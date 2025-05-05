import React from "react";
import { useParams } from "react-router-dom";
import styles from "./UserDetalhes.module.css";
import useListContatos from "../hooks/useListContatos";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

function UserDetalhes() {
    const { matchId } = useParams(); // matchId vindo da URL
    const { contatos, loading, error } = useListContatos();
    const userIdDaSessao = verificarSessaoUsuario();


    // Encontrar o usuário associado ao matchId, diferente do usuário da sessão
    const outroUsuario = contatos.find(
        contato =>
            contato.matchId.toString() === matchId &&
            contato.id !== userIdDaSessao
    );    

    if (!outroUsuario) {
        return <div>Usuário não encontrado para este match.</div>;
    }

    return (
        <div className={styles.userDetails}>
            <h2>Detalhes do Perfil</h2>

            {outroUsuario.foto_perfil && (
                <div className={styles.userPhotoWrapper}>
                    <img
                        className={styles.userPhoto}
                        src={outroUsuario.foto_perfil}
                        alt={`Foto de ${outroUsuario.username}`}
                    />
                </div>
            )}

            <div className={styles.infoGroup}>
                <h3>Nome de Usuário</h3>
                <p className={styles.infoValue}>{outroUsuario.username}</p>
            </div>

            <div className={styles.infoGroup}>
                <h3>Bio</h3>
                <p className={styles.infoValue}>{outroUsuario.bio}</p>
            </div>
        </div>
    );
}

export default UserDetalhes;
