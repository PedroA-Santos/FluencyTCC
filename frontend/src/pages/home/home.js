import React, { useState } from "react";
import Contatos from "../../components/Contatos";
import useBuscarMatches from "../../hooks/useBuscarMatches";
import styles from "./home.module.css";
import verificarSessaoUsuario from "../../utils/verificarSessaoUsuario";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Home() {
    const { users, loading, error } = useBuscarMatches();
    const [currentIndex, setCurrentIndex] = useState(0);

    const userIdDaSessao = verificarSessaoUsuario();
    console.log(users)

    if (error) {
        return <div className={styles.errorMessage}>Erro ao carregar sugestões: {error}</div>;
    }

    if (loading) {
        return <div className={styles.loading}>Carregando...</div>;
    }

    // Função para avançar para o próximo card
    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1); // Avança para o próximo índice
        } else {
            console.log("Alcançou o fim da lista!");
        }
    };

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
                                    src={user.foto_perfil || "/images/default-image.jpg"}
                                    alt={user.username}
                                    className={styles.profileImage}
                                />
                                <h2>{user.username}</h2>
                                <p>{user.bio || "Sem descrição"}</p>


                                {isTopCard && (
                                    <div className={styles.actionButtons}>
                                        <button onClick={handleNext} className={styles.rejectButton}>❌</button>
                                        <button onClick={handleNext} className={styles.acceptButton}>💖</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Detalhes à direita */}
                <div className={styles.userDetails}>
                    {users[currentIndex] && (
                        <>
                            <h2>Informações</h2>

                            <div className={styles.infoGroup}>
                                <h3><strong>Idiomas que está aprendendo:</strong></h3>
                                <p className={styles.infoValue}>{users[currentIndex].idiomas_aprendendo}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3><strong>Idioma Nativo:</strong></h3>
                                <p className={styles.infoValue}>{users[currentIndex].idioma_nativo}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3><strong>Interesses:</strong></h3>
                                <p className={styles.infoValue}>{users[currentIndex].interesses}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3><strong>Gênero:</strong></h3>
                                <p className={styles.infoValue}>{users[currentIndex].generos}</p>
                            </div>

                            <div className={styles.infoGroup}>
                                <h3><strong>País:</strong></h3>
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
