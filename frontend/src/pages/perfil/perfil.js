import styles from './perfil.module.css';
import usePerfilUsuario from '../../hooks/usePerfilUsuario';
import useListInteressesUsuario from '../../hooks/useListInteressesUsuario';
import verificarSessaoUsuario from '../../utils/verificarSessaoUsuario';
import { useNavigate, useParams } from 'react-router-dom';

function Perfil() {
    const { id } = useParams(); // pegando ID da URL
    const userIdLogado = verificarSessaoUsuario(); // ID do usuário logado
    const isMeuPerfil = String(userIdLogado) === String(id); // verifica se é o próprio perfil

    const { perfil, loading, error } = usePerfilUsuario(id); // passando o ID explicitamente
    const { interesses, error: errorInteresses } = useListInteressesUsuario(id); // passando o ID

    const navigate = useNavigate();

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!perfil) return <div>Perfil não encontrado.</div>;
    if (errorInteresses) return <div>Você não possui interesses no momento</div>;
    if (interesses.length === 0) return <div>Nenhum interesse encontrado.</div>;

    const imageUrl = perfil.foto_perfil
        ? `http://localhost:5000${perfil.foto_perfil}`
        : "/images/default-image.jpg";

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <img
                    src={imageUrl}
                    alt={perfil.username}
                    className={styles.profileImage}
                />

                <h1 className={styles.nameUser}>{perfil.username}</h1>
                <p className={styles.bioUser}>"{perfil.bio}"</p>

                <div className={styles.divider}></div>

                <div className={styles.infoGroup}>
                    <p className={styles.infosUser}><strong>Idioma:</strong> {perfil.idioma}</p>
                    <p className={styles.infosUser}><strong>Gênero:</strong> {perfil.genero}</p>
                    <p className={styles.infosUser}><strong>País:</strong> {perfil.pais}</p>
                </div>

                <div className={styles.divider}></div>

                <h2 className={styles.interessesTitle}>Interesses</h2>
                <div className={styles.interessesContainer}>
                    {interesses.map(interesse => (
                        <div key={interesse.id} className={styles.interesses}>
                            <p>{interesse.interesse}</p>
                        </div>
                    ))}
                </div>

                <button
                    className={styles.buttonCustom}
                    onClick={() => navigate('/')}
                >
                    Home
                </button>

                {isMeuPerfil && (
                    <div className={styles.buttons}>
                        <button
                            className={styles.buttonCustom}
                            onClick={() => navigate(`/editarPerfil/${userIdLogado}`)}
                        >
                            Editar Perfil
                        </button>
                    </div>

                )}
            </div>
        </div>

    );
}

export default Perfil;
