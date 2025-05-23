import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contatos.module.css";
import useListContatos from "../hooks/useListContatos";
import usePerfilUsuario from "../hooks/usePerfilUsuario";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

function Contatos() {
    const userIdDaSessao = verificarSessaoUsuario();
    const { contatos, error, loading } = useListContatos();
    const { perfil, error: perfilError, loading: perfilLoading } = usePerfilUsuario(userIdDaSessao);
    const navigate = useNavigate();

    //Função de logout
    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/login");
    }

    if (loading || perfilLoading) {
        return <div>Carregando contatos...</div>;
    }

    if (error || perfilError) {
        return <div style={{ color: 'red' }}>Erro: {error || perfilError}</div>;
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
                    {contatos.map(match => {
                        const imagePerfilContato = match.foto_perfil
                            ? `http://localhost:5000${match.foto_perfil}`
                            : "/images/default-image.jpg";

                        return (
                            <li
                                key={match.id}
                                className={styles.matchItem}
                                onClick={() => navigate(`/chat/${match.matchId}`)}
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
                                        e.stopPropagation(); // Impede que o clique na imagem acione o onClick do li                                    }}
                                        navigate(`/perfil/${match.id}`);
                                    }}
                                />
                                < p
                                    onClick={() => navigate(`/chat/${match.matchId}`)}
                                    className={styles.usernameMatch}
                                >
                                    {match.username}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div >
    );
}

export default Contatos;
