// backend/socket/chatSocket.js
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { verificarMatch, obterHistoricoMensagens, salvarMensagem } = require("../services/chatService");

const secretKey = process.env.SECRET_KEY;

const configurarSocket = (io) => { 
    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (!token) {
            return next(new Error("Token não fornecido"));
        }
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return next(new Error("Token inválido"));
            }
            socket.usuarioId = decoded.id;
            next();
        });
    });
    
    io.on("connection", (socket) => {
        const usuarioId = socket.usuarioId;
        console.log(`Usuário conectado: ${socket.id}, ID do usuario: ${usuarioId}`);

        // Usuário entra na sala específica para seu ID
        socket.join(`usuario-${usuarioId}`);

        socket.on("entrarChat", ({ matchId }) => {
            verificarMatch(matchId, usuarioId, (err, match) => {
                if (err) {
                    socket.emit("erro", err.message);
                    return;
                }
                const sala = `match-${matchId}`;
                socket.join(sala);
                console.log(`Usuário ${usuarioId} entrou na sala ${sala}`);

                obterHistoricoMensagens(matchId, (err, mensagens) => {
                    if (!err) {
                        socket.emit("historico", mensagens);
                    }
                });
            });
        });

        socket.on("enviarMensagem", ({ matchId, conteudo }) => {
            verificarMatch(matchId, usuarioId, (err, match) => {
                if (err) return;
                const { usuario1_id, usuario2_id } = match;
                const destinatarioId = usuarioId == usuario1_id ? usuario2_id : usuario1_id;

                salvarMensagem(matchId, usuarioId, destinatarioId, conteudo, (err) => {
                    if (err) {
                        console.error("Erro ao salvar mensagem:", err);
                        return;
                    }
                    const mensagem = {
                        matchId,
                        remetente_id: usuarioId,
                        conteudo,
                        enviado_em: new Date(),
                    };
                    const sala = `match-${matchId}`;
                    io.to(sala).emit("novaMensagem", mensagem);
                });
            });
        });

        socket.on("disconnect", () => {
            console.log(`Usuário desconectado: ${socket.id}`);
        });
    });
};

module.exports = configurarSocket;