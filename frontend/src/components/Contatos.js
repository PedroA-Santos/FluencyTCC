import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contatos.module.css";
import useListContatos from "../hooks/useListContatos";
import usePerfilUsuario from "../hooks/usePerfilUsuario";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

function Contatos() {
    const { contatos, error, loading } = useListContatos();
    const { perfil, error: perfilError, loading: perfilLoading } = usePerfilUsuario();
    const navigate = useNavigate();
    const userIdDaSessao = verificarSessaoUsuario();

  

  
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
                />
                <h2>{perfil.username}</h2>
            </div>

            <div className={styles.matchesContainer}>
                <h2>Matches</h2>
                <ul>
                    {contatos.map(match => {
                        const imagePerfilContato = match.foto_perfil
                            ? `http://localhost:5000${match.foto_perfil}`
                            : "/images/default-image.jpg";

                        return (
                            <li key={match.id} className={styles.matchItem}>
                                <img
                                    src={imagePerfilContato}
                                    alt={match.username}
                                    className={styles.profileImage}
                                    onClick={() => {
                                        navigate(`/chat/${match.matchId}`);
                                        console.log("ID do Match enviado:", match.matchId);
                                    }}
                                />
                                <p className={styles.usernameMatch}>{match.username}</p>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default Contatos;
