import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useListContatos from "../hooks/useListContatos";
import calcularIdade from "../utils/calcularIdade";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";
import styles from "./UserDetalhes.module.css";

function UserDetalhes() {
    const { matchId } = useParams();
    const { contatos } = useListContatos();
    const userIdDaSessao = verificarSessaoUsuario();
    const navigate = useNavigate();

    const outroUsuario = contatos.find(
        contato =>
            contato.matchId.toString() === matchId &&
            contato.id !== userIdDaSessao
    );

    if (!outroUsuario) {
        return <div>Usuário não encontrado para este match.</div>;
    }

    const idadeUsuario = calcularIdade(outroUsuario.idade);

    const imageUrl = outroUsuario.foto_perfil
        ? `http://localhost:5000${outroUsuario.foto_perfil}`
        : "/images/default-image.jpg";

    return (
        <div className={styles.userDetails}>
            <h2 className={styles.title}>Detalhes do Perfil</h2>

            <div className={styles.userPhotoWrapper}>
                <img
                    className={styles.userPhoto}
                    src={imageUrl}
                    alt={`Foto de ${outroUsuario.username}`}
                    onClick={() =>
                        navigate(`/perfil/${outroUsuario.id}`, {
                            state: {
                                fromChat: true,
                                matchId: matchId,
                            },
                        })
                    }
                />
            </div>

            <div className={styles.infoGroup}>
                <label className={styles.infoLabel}>Nome de usuário:</label>
                <p className={styles.infoValue}>{outroUsuario.username}</p>
            </div>

            <div className={styles.infoGroup}>
                <label className={styles.infoLabel}>Bio:</label>
                <p className={styles.infoValue}>{outroUsuario.bio}</p>
            </div>

            <div className={styles.infoGroup}>
                <label className={styles.infoLabel}>País de origem:</label>
                <p className={styles.infoValue}>{outroUsuario.pais}</p>
            </div>

            <div className={styles.infoGroup}>
                <label className={styles.infoLabel}>Idioma nativo:</label>
                <p className={styles.infoValue}>{outroUsuario.idioma}</p>
            </div>

            <div className={styles.infoGroup}>
                <label className={styles.infoLabel}>Idade:</label>
                <p className={styles.infoValue}>
                    {idadeUsuario !== null ? `${idadeUsuario} anos` : "Idade não disponível"}
                </p>
            </div>
        </div>
    );
}

export default UserDetalhes;
