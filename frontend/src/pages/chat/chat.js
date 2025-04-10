import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Chat = () => {
    const { matchId } = useParams(); // Pega o matchId da URL
    const socketRef = useRef(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState("");
    const usuarioId = "1"; // Simulado por agora; substitua por autenticação real

    useEffect(() => {
        socketRef.current = io("http://localhost:5000");

        // Entrar no chat
        socketRef.current.emit("entrarChat", { matchId, usuarioId });

        // Receber histórico
        socketRef.current.on("historico", (historico) => {
            setMensagens(historico);
        });

        // Receber novas mensagens
        socketRef.current.on("novaMensagem", (mensagem) => {
            setMensagens((prev) => [...prev, mensagem]);
        });

        // Tratar erros
        socketRef.current.on("erro", (msg) => {
            console.error("Erro:", msg);
        });

        return () => {
            socketRef.current.off("historico");
            socketRef.current.off("novaMensagem");
            socketRef.current.off("erro");
            socketRef.current.disconnect();
        };
    }, [matchId]);

    const enviarMensagem = () => {
        if (novaMensagem.trim()) {
            socketRef.current.emit("enviarMensagem", { matchId, usuarioId, conteudo: novaMensagem });
            setNovaMensagem("");
        }
    };

    return (
        <div>
            <h1>Chat do Match {matchId}</h1>
            <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
                {mensagens.map((msg, index) => (
                    <p key={index}>
                        {msg.remetente_id === usuarioId ? "Você" : "Outro"}: {msg.conteudo} ({new Date(msg.enviado_em).toLocaleTimeString()})
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem"
            />
            <button onClick={enviarMensagem}>Enviar</button>
        </div>
    );
};

export default Chat;