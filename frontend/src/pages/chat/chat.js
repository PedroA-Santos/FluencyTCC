import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Chat = () => {
    const { matchId } = useParams();
    const socketRef = useRef(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState("");

    // Obtém o usuário e o token fora do useEffect
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        // Verificações simples
        if (!user || !token) {
            console.error("Usuário ou token não encontrado.");
            return;
        }

        // Conexão socket
        socketRef.current = io("http://localhost:5000", {
            query: { token },
        });

        // Ao conectar
        socketRef.current.on("connect", () => {
            console.log("Conectado com ID:", socketRef.current.id);
            socketRef.current.emit("entrarChat", { matchId });
        });

        socketRef.current.on("historico", (historico) => {
            setMensagens(historico);
        });

        socketRef.current.on("novaMensagem", (mensagem) => {
            setMensagens((prev) => [...prev, mensagem]);
        });

        socketRef.current.on("erro", (msg) => {
            console.error("Erro:", msg);
        });

        return () => {
            socketRef.current.off("connect");
            socketRef.current.off("historico");
            socketRef.current.off("novaMensagem");
            socketRef.current.off("erro");
            socketRef.current.disconnect();
        };
    }, [matchId]); // matchId é estável, então não gera loop

    const enviarMensagem = () => {
        if (novaMensagem.trim() && user && socketRef.current) {
            socketRef.current.emit("enviarMensagem", {
                matchId,
                conteudo: novaMensagem,
            });
            setNovaMensagem("");
        }
    };

    return (
        <div>
            <h1>Chat do Match {matchId}</h1>
            <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc" }}>
                {mensagens.map((msg, index) => (
                    <p key={index}>
                        {msg.remetente_id === user?.id ? "Você" : "Outro"}: {msg.conteudo} (
                        {new Date(msg.enviado_em).toLocaleTimeString()})
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
