import React, { useState, useEffect, useRef } from "react";
import Contatos from "../../components/Contatos";
import UserDetalhes from "../../components/UserDetalhes";
import useListContatos from "../../hooks/useListContatos";
import verificarSessaoUsuario from "../../utils/verificarSessaoUsuario";
import styles from "./chat.module.css";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { matchId } = useParams();
  const { contatos, loading, error } = useListContatos();
  const socketRef = useRef(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const userIdDaSessao = verificarSessaoUsuario();

  const contato = contatos.find(
    (contato) =>
      contato.matchId.toString() === matchId && contato.id !== userIdDaSessao
  );
  
  const nome = contato?.username;

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      console.error("Usuário ou token não encontrado.");
      return;
    }

    socketRef.current = io("http://localhost:5000", {
      query: { token },
    });

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
  }, [matchId]);

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
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <Contatos />
      </div>

      <div className={styles.chatArea}>
        <header className={styles.header}>
          <h2>{nome}</h2>
        </header>

        <div className={styles.messages}>
          {mensagens.map((msg, index) => {
            const isMinhaMensagem = msg.remetente_id === user?.id;
            return (
              <div
                key={index}
                className={`${styles.message} ${isMinhaMensagem ? styles.me : styles.other}`}
              >
                <p className={styles.messageContent}>{msg.conteudo}</p>
                <small className={styles.time}>
                  {new Date(msg.enviado_em).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            );
          })}
        </div>

        <footer className={styles.footer}>
          <input
            type="text"
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem"
            className={styles.input}
          />
          <button onClick={enviarMensagem} className={styles.button}>
            Enviar
          </button>
        </footer>
      </div>

      <div className={styles.userDetalhesWrapper}>
        <UserDetalhes />
      </div>
    </div>
  );
};

export default Chat;
