import React, { useState } from "react";
import Contatos from "../../components/Contatos";
import useBuscarMatches from "../../hooks/useBuscarMatches";
import styles from "./home.module.css";
import verificarSessaoUsuario from "../../utils/verificarSessaoUsuario";
import useAceitarMatch from "../../hooks/useAceitarMatch";

function Home() {
    const { users, loading, error } = useBuscarMatches();
    const [currentIndex, setCurrentIndex] = useState(0);

    const { aceitarMatch, loading: matchLoading, erro, sucesso } = useAceitarMatch();
    const userIdDaSessao = verificarSessaoUsuario();

    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
            alert("Você chegou ao fim da lista de sugestões!");
        }
    };

    const handleAcceptMatch = () => {
        const currentUser = users[currentIndex];
        aceitarMatch(
            currentUser.id,
            userIdDaSessao,
            currentUser.id,
            currentUser.idioma_comum || currentUser.idiomas_aprendendo,
            handleNext
        );
    };

    const getImagemPerfilCard = (foto_perfil) => {
        return foto_perfil ? `http://localhost:5000${foto_perfil}` : "/images/default-image.jpg";
    };

    if (error) {
        return <div className={styles.errorMessage}>Erro ao carregar sugestões: {error}</div>;
    }

    if (loading) {
        return <div className={styles.loading}>Carregando sugestões...</div>;
    }

    return (
        <div className={styles.mainContainer}>
            <Contatos />

            <div className={styles.stackContainer}>
                <div className={styles.cardStack}>
                    {users.map((user, i) => {
                        if (i < currentIndex) return null;

                        const isTopCard = i === currentIndex;
                        const isBehindCard = i > currentIndex;

                        return (
                            <div
                                key={user.id}
                                className={`${styles.card} ${isTopCard ? styles.topCard : styles.behindCard}`}
                                style={{
                                    zIndex: users.length - i,
                                    transform: isBehindCard
                                        ? `translateY(${(i - currentIndex) * 10}px) scale(${1 - (i - currentIndex) * 0.05})`
                                        : "translateY(0)",
                                    opacity: isBehindCard ? 0.8 : 1,
                                }}
                            >
                                <img
                                    src={getImagemPerfilCard(user.foto_perfil)}
                                    alt={user.username}
                                    className={styles.profileImage}
                                />
                                <h2>{user.username}</h2>
                                <p>{user.bio || "Sem descrição"}</p>

                                {isTopCard && (
                                    <div className={styles.actionButtons}>
                                        <button onClick={handleNext} className={styles.rejectButton} aria-label="Rejeitar">❌</button>
                                        <button onClick={handleAcceptMatch} className={styles.acceptButton} aria-label="Aceitar">💖</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.userDetails}>
                    {users[currentIndex] && (
                        <>
                            <h2>Detalhes do Perfil</h2>

                            <div className={styles.infoGroup}>
                                <h3>Idiomas que está aprendendo</h3>
                                <p className={styles.infoValue}>{users[currentIndex].idiomas_aprendendo}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3>Idioma Nativo</h3>
                                <p className={styles.infoValue}>{users[currentIndex].idioma_nativo}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3>Interesses</h3>
                                <p className={styles.infoValue}>{users[currentIndex].interesses}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3>Gênero</h3>
                                <p className={styles.infoValue}>{users[currentIndex].generos}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3>País</h3>
                                <p className={styles.infoValue}>{users[currentIndex].paises_origem}</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;