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
  const fimDasMensagensRef = useRef(null);

  const userIdDaSessao = verificarSessaoUsuario();

  const contato = contatos.find(
    (contato) =>
      contato.matchId.toString() === matchId && contato.id !== userIdDaSessao
  );

  const nome = contato?.username;

  const user = JSON.parse(sessionStorage.getItem("userId"));
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!user || !token || !matchId) {
      console.error("Usuário, token ou matchId não encontrado.");
      return;
    }

    // Limpa mensagens ao trocar de matchId
    setMensagens([]);

    // Conecta ao socket
    const socket = io("http://localhost:5000", {
      query: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Conectado com ID:", socket.id);
      socket.emit("entrarChat", { matchId });
    });

    socket.on("historico", (historico) => {
      setMensagens(historico);
    });

    socket.on("novaMensagem", (mensagem) => {
      setMensagens((prev) => [...prev, mensagem]);
    });

    socket.on("erro", (msg) => {
      console.error("Erro:", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("historico");
      socket.off("novaMensagem");
      socket.off("erro");
      socket.disconnect();
    };
  }, [matchId, token, user]);

  useEffect(() => {
    if (fimDasMensagensRef.current) {
      fimDasMensagensRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [mensagens]);

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
            const isMinhaMensagem =
              String(msg.remetente_id) === String(userIdDaSessao);
            return (
              <div
                key={index}
                className={`${styles.message} ${
                  isMinhaMensagem ? styles.me : styles.other
                }`}
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
          <div ref={fimDasMensagensRef} />
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
