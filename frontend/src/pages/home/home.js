import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Contatos from "../../components/Contatos";
import useBuscarMatches from "../../hooks/useBuscarMatches";
import styles from "./home.module.css";
import verificarSessaoUsuario from "../../utils/verificarSessaoUsuario";
import useAceitarMatch from "../../hooks/useAceitarMatch";
import { useMatch } from "../../context/matchContext";
import useMobile from "../../hooks/useMobile";
import { useMenu } from "../../context/menuContext";

function Home() {
    const { users, loading, error } = useBuscarMatches();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [buscandoMais, setBuscandoMais] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [feedbackType, setFeedbackType] = useState("");
    const { menuAberto, setMenuAberto, menuToggleRef } = useMenu();
    const isMobile = useMobile();
    const navigate = useNavigate();
    const { aceitarMatch } = useAceitarMatch();
    const userIdDaSessao = verificarSessaoUsuario();
    const { notificarMatch } = useMatch();

    const showFeedback = (type) => {
        setFeedbackType(type);
        setFeedbackMessage(type === "like" ? "💖 Curtido!" : "❌ Rejeitado!");
        setTimeout(() => {
            setFeedbackMessage("");
            setFeedbackType("");
        }, 1500);
    };

    const handleNext = () => {
        if (currentIndex < users.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setBuscandoMais(false);
        } else {
            setBuscandoMais(true);
        }
    };

    const handleAcceptMatch = () => {
        const currentUser = users[currentIndex];
        aceitarMatch(
            currentUser.id,
            userIdDaSessao,
            currentUser.idioma_comum || currentUser.idiomas_aprendendo.split(", ")[0],
            () => {
                notificarMatch();
                showFeedback("like");
                handleNext();
            }
        );
    };

    const handleRejectMatch = () => {
        showFeedback("dislike");
        handleNext();
    };

    const getImagemPerfilCard = (foto_perfil) => {
        return foto_perfil ? `http://localhost:5000${foto_perfil}` : "/images/default-image.jpg";
    };
    
    useEffect(() => {
        if (!loading && users.length === 0) {
            setBuscandoMais(true);
        }
    }, [loading, users]);

    if (error) return <div className={styles.errorMessage}>Erro ao carregar sugestões: {error}</div>;

    if (loading)
        return (
            <div className={styles.loading}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className={styles.loader}
                />
                Carregando sugestões...
            </div>
        );

    const currentUser = users[currentIndex];

    return (
        <div className={styles.mainContainer}>
            {/* BOTÃO ☰ */}
            <button
                ref={menuToggleRef}
                className={styles.menuToggle}
                onClick={() => setMenuAberto((prev) => !prev)}
            >
                ☰
            </button>

            {/* MENU LATERAL */}
            <div className={`${styles.contatosContainer} ${menuAberto ? styles.menuAberto : ""}`}>
                <Contatos
                    menuAberto={menuAberto}
                    setMenuAberto={setMenuAberto}
                    menuToggleRef={menuToggleRef}
                />
            </div>

            {/* STACK DE USUÁRIOS */}
            <div className={styles.stackContainer}>
                <div className={styles.cardStack}>
                    <AnimatePresence mode="wait">
                        {!buscandoMais && currentUser && (
                            <motion.div
                                key={currentUser.id}
                                className={styles.card}
                                initial={{ x: 300, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -300, opacity: 0 }}
                                transition={{ duration: 0.6, type: "spring" }}
                            >
                                <div className={styles.cardImageContainer}>
                                    <motion.img
                                        src={getImagemPerfilCard(currentUser.foto_perfil)}
                                        alt={currentUser.username}
                                        className={styles.profileImage}
                                        whileHover={{ scale: 1.05 }}
                                        onClick={() => navigate(`/perfil/${currentUser.id}`)}
                                    />
                                    <div className={styles.cardOverlay} />
                                    <div className={styles.cardInfo}>
                                        <h2>{currentUser.username}</h2>
                                        <p>{currentUser.bio || "Sem descrição"}</p>
                                        <div className={styles.userDetailsInsideCard}>
                                            <h3>Interesses</h3>
                                            <div className={styles.interessesContainer}>
                                                <p className={styles.interessesTag}>{currentUser.interesses || "Sem interesses"}</p>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <motion.div
                                    className={styles.actionButtons}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <motion.button
                                        onClick={handleRejectMatch}
                                        className={styles.rejectButton}
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ rotate: -10 }}
                                    >
                                        ❌
                                    </motion.button>
                                    <motion.button
                                        onClick={handleAcceptMatch}
                                        className={styles.acceptButton}
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ rotate: 10 }}
                                    >
                                        💖
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {buscandoMais && <div className={styles.semMaisUsuarios}>Buscando mais sugestões...</div>}
                </div>

                {!isMobile && currentUser && (
                    <motion.div
                        className={styles.userDetails}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2>Detalhes do Perfil</h2>
                        <div className={styles.infoGroup}>
                            <h3>Idiomas que está aprendendo</h3>
                            <p className={styles.infoValue}>{currentUser.idiomas_aprendendo}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <h3>Idioma Nativo</h3>
                            <p className={styles.infoValue}>{currentUser.idioma_nativo}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <h3>Interesses</h3>
                            <p className={styles.infoValue}>{currentUser.interesses}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <h3>Gênero</h3>
                            <p className={styles.infoValue}>{currentUser.generos}</p>
                        </div>
                        <div className={styles.infoGroup}>
                            <h3>País</h3>
                            <p className={styles.infoValue}>{currentUser.paises_origem}</p>
                        </div>
                    </motion.div>
                )}
            </div>

            <AnimatePresence>
                {feedbackMessage && (
                    <motion.div
                        key="feedback"
                        className={`${styles.feedbackMessage} ${feedbackType === "like" ? styles.like : styles.dislike}`}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        transition={{ duration: 0.4 }}
                    >
                        {feedbackMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;