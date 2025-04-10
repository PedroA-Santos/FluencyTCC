//Este arquivo terá a lógica do Socket.IO

// backend/socket/chatSocket.js
const { verificarMatch, obterHistoricoMensagens, salvarMensagem } = require("../services/chatService");

const configurarSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`Usuário conectado: ${socket.id}`);

        socket.on("entrarChat", ({ matchId, usuarioId }) => {
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

        socket.on("enviarMensagem", ({ matchId, usuarioId, conteudo }) => {
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