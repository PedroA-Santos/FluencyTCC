import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contatos.module.css";
import useListContatos from "../hooks/useListContatos";
import useDesfazerMatch from "../hooks/useDesfazerMatch";
import usePerfilUsuario from "../hooks/usePerfilUsuario";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

function Contatos() {
    const userIdDaSessao = verificarSessaoUsuario();
    const { contatos, error, loading } = useListContatos();
    const { perfil, error: perfilError, loading: perfilLoading } = usePerfilUsuario(userIdDaSessao);
    const { desfazerMatch, loading: desfazerLoading, error: desfazerError } = useDesfazerMatch();
    const navigate = useNavigate();
    const [localContatos, setLocalContatos] = useState(contatos);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, matchId: null });

    //atualizar contatos localmente quando os contatos mudam
    useEffect(() => {
        setLocalContatos(contatos);
    }, [contatos]);

    // fecha o menu de contexto ao clicar fora
    useEffect(() => {
        const handleClickOutside = () => {
            setContextMenu({ visible: false, x: 0, y: 0, matchId: null });
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    //Função de logout
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    }

    const handleDesfazerMatch = async (matchId) => {
        try {
            await desfazerMatch(matchId, userIdDaSessao);
            // remove o contato da lista localmente
            setLocalContatos((prev) => prev.filter((contato) => contato.matchId !== matchId));
            setContextMenu({ visible: false, x: 0, y: 0, matchId: null });
        } catch (err) {
            console.error("Erro ao desfazer match: ", err);
        }
    };

    const handleContextMenu = (e, matchId) => {
        e.preventDefault(); //pra impedir o menu de contexto do navegador
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            matchId,
        });
    };

    if (loading || perfilLoading) {
        return <div>Carregando contatos...</div>;
    }

    if (error || perfilError || desfazerError) {
        return <div style={{ color: "red" }}>Erro: {error || perfilError || desfazerError}</div>;    
    }
    
    const imageUrl = perfil.foto_perfil
        ? `http://localhost:5000${perfil.foto_perfil}`
        : "/images/default-image.jpg";

    return (
        <div className={styles.containerLateral}>
            <div className={styles.profileContainer}>
                <img
                    src={imageUrl}
                    alt={perfil.username}
                    className={styles.profileImage}
                    onClick={() => navigate(`/perfil/${userIdDaSessao}`)}
                />
                <h2>{perfil.username}</h2>
                <div className={styles.buttonGroup}>
                    <button
                        className={styles.homeButton}
                        onClick={() => navigate("/")}
                        aria-label="Voltar para a página inicial"
                    >
                        Home
                    </button>
                    <button
                        className={styles.logoutButton}
                        onClick={handleLogout}
                        aria-label="Encerrar sessão"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className={styles.matchesContainer}>
                <h2>Matches</h2>
                <ul>
                    {localContatos.map(match => {
                        const imagePerfilContato = match.foto_perfil
                            ? `http://localhost:5000${match.foto_perfil}`
                            : "/images/default-image.jpg";

                        return (
                            <li
                                key={match.id}
                                className={styles.matchItem}
                                onClick={() => navigate(`/chat/${match.matchId}`)}
                                onContextMenu={(e) => handleContextMenu(e, match.matchId)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        navigate(`/chat/${match.matchId}`);
                                    }
                                }}
                            >

                                <img
                                    src={imagePerfilContato}
                                    alt={match.username}
                                    className={styles.profileImage}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/perfil/${match.id}`);
                                    }}
                                />
                                < p className={styles.usernameMatch}>{match.username}</p>
                            </li>
                        );
                    })}
                </ul>
                {contextMenu.visible && (
                    <div
                        className={styles.contextMenu}
                        style={{ top: contextMenu.y, left: contextMenu.x }}
                    >
                        <button
                            onClick={() => handleDesfazerMatch(contextMenu.matchId)}
                            disabled={desfazerLoading}
                            className={styles.contextMenuItem}
                        >
                            Desfazer Match
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Contatos;