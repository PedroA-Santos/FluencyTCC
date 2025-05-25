import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Contatos from "../../components/Contatos";
import useBuscarMatches from "../../hooks/useBuscarMatches";
import styles from "./home.module.css";
import verificarSessaoUsuario from "../../utils/verificarSessaoUsuario";
import useAceitarMatch from "../../hooks/useAceitarMatch";

function Home() {
    const { users, loading, error } = useBuscarMatches();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [swipeDirection, setSwipeDirection] = useState("");
    const [buscandoMais, setBuscandoMais] = useState(false);
    const navigate = useNavigate();

    const { aceitarMatch, loading: matchLoading, erro, sucesso } = useAceitarMatch();
    const userIdDaSessao = verificarSessaoUsuario();

    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex((prevIndex) => prevIndex + 1);
            setBuscandoMais(false);
        } else {
            setBuscandoMais(true);
            // Aqui podemos simular um delay ou buscar mais usuários no futuro

        }
    };

    const animateAndGoNext = (direction) => {
        setSwipeDirection(direction);
        setTimeout(() => {
            setSwipeDirection("");
            handleNext();
        }, 600);
    };

    const handleAcceptMatch = () => {
    const currentUser = users[currentIndex];
    aceitarMatch(
        currentUser.id, // suggestedUserId
        userIdDaSessao, // userId
        currentUser.idioma_comum || currentUser.idiomas_aprendendo.split(', ')[0], // idiomaComum
        () => animateAndGoNext("right")
    );
};

    const handleRejectMatch = () => {
        animateAndGoNext("left");
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
                    {!buscandoMais && currentIndex < users.length ? (
                        (() => {
                            const user = users[currentIndex];
                            return (
                                <div
                                    key={user.id}
                                    className={`
                        ${styles.card}
                        ${swipeDirection === "right" ? styles.swipeRight : ""}
                        ${swipeDirection === "left" ? styles.swipeLeft : ""}
                        ${styles.topCard}
                    `}
                                    style={{
                                        zIndex: 10,
                                        transform: "translateY(0)",
                                        opacity: 1,
                                    }}
                                >
                                    {swipeDirection === "right" && (
                                        <div className={`${styles.swipeText} ${styles.liked}`}>Curtido 💖</div>
                                    )}
                                    {swipeDirection === "left" && (
                                        <div className={`${styles.swipeText} ${styles.rejected}`}>Rejeitado ❌</div>
                                    )}

                                    <img
                                        src={getImagemPerfilCard(user.foto_perfil)}
                                        alt={user.username}
                                        className={styles.profileImage}
                                        onClick={() => navigate(`/perfil/${user.id}`)}
                                    />

                                    <h2>{user.username}</h2>
                                    <p>{user.bio || "Sem descrição"}</p>

                                    <div className={styles.actionButtons}>
                                        <button onClick={handleRejectMatch} className={styles.rejectButton} aria-label="Rejeitar">❌</button>
                                        <button onClick={handleAcceptMatch} className={styles.acceptButton} aria-label="Aceitar">💖</button>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className={styles.semMaisUsuarios}>
                            {buscandoMais
                                ? "Buscando mais sugestões..."
                            : "Nenhuma nova sugestão no momento. Tente novamente mais tarde. 🙁"}
                        </div>
                    )}
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
