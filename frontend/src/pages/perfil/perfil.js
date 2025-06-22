import styles from './perfil.module.css';
import { useEffect } from 'react';
import Contatos from '../../components/Contatos';
import usePerfilUsuario from '../../hooks/usePerfilUsuario';
import useListInteressesUsuario from '../../hooks/useListInteressesUsuario';
import verificarSessaoUsuario from '../../utils/verificarSessaoUsuario';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMenu } from "../../context/menuContext";
import useListIdiomasUsuario from '../../hooks/useListIdiomasUsuario';

function Perfil() {
    const { id } = useParams();
    const userIdLogado = verificarSessaoUsuario();
    const isMeuPerfil = String(userIdLogado) === String(id);

    const { perfil, loading, error } = usePerfilUsuario(id);
    const { interesses, error: errorInteresses } = useListInteressesUsuario(id);
    const { menuAberto, setMenuAberto, menuToggleRef } = useMenu();
    const { idiomas: idiomasUsuario, loading: loadingIdiomasUsuario, error: errorIdiomasUsuario } = useListIdiomasUsuario(id);

    const navigate = useNavigate();
    const location = useLocation();
    const fromChat = location.state?.fromChat;
    const matchId = location.state?.matchId;

    if (loading || loadingIdiomasUsuario) return <div>Carregando...</div>;
    if (error || errorIdiomasUsuario) return <div>{error || errorIdiomasUsuario}</div>;
    if (!perfil) return <div>Perfil não encontrado.</div>;
    if (errorInteresses) return <div>Você não possui interesses no momento</div>;
    if (interesses.length === 0) return <div>Nenhum interesse encontrado.</div>;

    const handleVoltarAoChat = () => {
        navigate(`/chat/${matchId || ''}`);
    };

    const imageUrl = perfil.foto_perfil
        ? `http://localhost:5000${perfil.foto_perfil}`
        : "/images/default-image.jpg";

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.2,
                duration: 0.6,
                type: 'spring',
                stiffness: 100,
            }
        })
    };

    const zoomRotate = {
        hidden: { scale: 0, rotate: -180, opacity: 0 },
        visible: {
            scale: 1,
            rotate: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                type: 'spring',
                stiffness: 90
            }
        }
    };

    const bounceIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: [0.175, 0.885, 0.32, 1.275]
            }
        }
    };

    return (
        <div className={styles.container}>
            <button
                ref={menuToggleRef}
                className={styles.menuToggle}
                onClick={() => setMenuAberto((prev) => !prev)}
            >
                ☰
            </button>

            <Contatos />

            <motion.div
                className={styles.profileCard}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                custom={0}
            >
                <motion.img
                    src={imageUrl}
                    alt={perfil.username}
                    className={styles.profileImage}
                    variants={zoomRotate}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                />

                <motion.h1
                    className={styles.nameUser}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={1}
                >
                    {perfil.username}
                </motion.h1>

                <motion.p
                    className={styles.bioUser}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={2}
                >
                    "{perfil.bio}"
                </motion.p>

                <motion.div
                    className={styles.divider}
                    variants={bounceIn}
                    initial="hidden"
                    animate="visible"
                />

                <motion.div
                    className={styles.infoGroup}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={3}
                >
                    <p className={styles.infosUser}><strong>Idioma Nativo:</strong> {perfil.idioma}</p>
                    <p className={styles.infosUser}><strong>Gênero:</strong> {perfil.genero}</p>
                    <p className={styles.infosUser}><strong>País:</strong> {perfil.pais}</p>
                </motion.div>

                <motion.div
                    className={styles.divider}
                    variants={bounceIn}
                    initial="hidden"
                    animate="visible"
                />

                <motion.h2
                    className={styles.interessesTitle}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={4}
                >
                    Interesses
                </motion.h2>

                <motion.div
                    className={styles.interessesContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {interesses.map((interesse, i) => (
                        <motion.div
                            key={interesse.id}
                            className={styles.interesses}
                            whileHover={{ scale: 1.2, rotate: 2 }}
                            variants={fadeInUp}
                            custom={i + 5}
                        >
                            <p>{interesse.interesse}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.h2
                    className={styles.interessesTitle}
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                    custom={interesses.length + 5}
                >
                    Estudando
                </motion.h2>

                <motion.div
                    className={styles.interessesContainer}
                    initial="hidden"
                    animate="visible"
                >
                    {idiomasUsuario.map((idioma, i) => (
                        <motion.div
                            key={idioma.id}
                            className={styles.interesses}
                            whileHover={{ scale: 1.2, rotate: 2 }}
                            variants={fadeInUp}
                            custom={interesses.length + i + 6}
                        >
                            <p>{idioma.idioma || idioma.nome || "Idioma desconhecido"}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {isMeuPerfil && (
                    <motion.div
                        className={styles.buttons}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        custom={interesses.length + idiomasUsuario.length + 6}
                    >
                        <motion.button
                            className={styles.buttonCustom}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            onClick={() => navigate(`/editarPerfil/${userIdLogado}`)}
                        >
                            Editar Perfil
                        </motion.button>
                    </motion.div>
                )}

                {fromChat && (
                    <motion.div
                        className={styles.buttons}
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        custom={interesses.length + idiomasUsuario.length + 7}
                    >
                        <motion.button
                            onClick={handleVoltarAoChat}
                            className={styles.buttonCustom}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            Voltar para o chat
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default Perfil;