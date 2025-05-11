import React from "react";
import { useParams } from "react-router-dom";
import styles from "./UserDetalhes.module.css";
import useListContatos from "../hooks/useListContatos";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

function UserDetalhes() {
    const { matchId } = useParams();
    const { contatos, loading, error } = useListContatos();
    const userIdDaSessao = verificarSessaoUsuario();

    const outroUsuario = contatos.find(
        contato =>
            contato.matchId.toString() === matchId &&
            contato.id !== userIdDaSessao
    );

    if (!outroUsuario) {
        return <div>Usuário não encontrado para este match.</div>;
    }

    console.log("Outro Usuário:", outroUsuario);
    

    const imageUrl = outroUsuario.foto_perfil
        ? `http://localhost:5000${outroUsuario.foto_perfil}`
        : "/images/default-image.jpg";

    return (
        <div className={styles.userDetails}>
            <h2>Detalhes do Perfil</h2>

            <div className={styles.userPhotoWrapper}>
                <img
                    className={styles.userPhoto}
                    src={imageUrl}
                    alt={`Foto de ${outroUsuario.username}`}
                />
            </div>

            <div className={styles.infoGroup}>
                <p className={styles.infoValue}>{outroUsuario.username}</p>
            </div>

            <div className={styles.infoGroup}>
                <p className={styles.infoValue}>{outroUsuario.bio}</p>
            </div>
        </div>
    );
}

export default UserDetalhes;
