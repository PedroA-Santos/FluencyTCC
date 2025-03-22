import React, { useState } from "react";
import Contatos from "../../components/Contatos";
import useBuscarMatches from "../../hooks/useBuscarMatches";
import styles from "./home.module.css";

function Home() {
    const { users, loading, error } = useBuscarMatches();
    const [currentIndex, setCurrentIndex] = useState(0);

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
                {users.map((user, i) => {
                    if (i < currentIndex) return null; // Ignora cartões que já passaram

                    const isTopCard = i === currentIndex; // Verifica se é o cartão no topo
                    const isBehindCard = i > currentIndex; // Verifica se é um cartão atrás

                    return (
                        <div
                            key={user.id}
                            className={`${styles.card} ${
                                isTopCard ? styles.topCard : styles.behindCard
                            }`}
                            style={{
                                zIndex: users.length - i, // Mantém a ordem de empilhamento
                                transform: isBehindCard
                                    ? `translateY(${(i - currentIndex) * 10}px) scale(${
                                          1 - (i - currentIndex) * 0.05
                                      })`
                                    : "translateY(0)", // Escala os cartões de trás
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
                            <p><strong>Idiomas aprendendo:</strong> {user.idiomas_aprendendo}</p>
                            <p><strong>Interesses:</strong> {user.interesses}</p>
                            {isTopCard && (
                                <button onClick={handleNext} className={styles.nextButton}>
                                    Próximo
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Home;
