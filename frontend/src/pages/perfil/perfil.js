import styles from './perfil.module.css';
import usePerfilUsuario from '../../hooks/usePerfilUsuario';
import useListInteressesUsuario from '../../hooks/useListInteressesUsuario';
import verificarSessaoUsuario from '../../utils/verificarSessaoUsuario';
import { useNavigate } from 'react-router-dom';

function Perfil() {
    // Usando o hook para pegar os dados do perfil do usuário
    const { perfil, loading, error } = usePerfilUsuario();
    // Usando o hook para pegar os interesses do usuário
    const { interesses, error: errorInteresses } = useListInteressesUsuario();
    // Recuperando o usuário logado da sessionStorage
    const userIdLogado = verificarSessaoUsuario();
    const navigate = useNavigate();

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;
    if (!perfil) return <div>Perfil não encontrado.</div>;
    if (errorInteresses) return <div>Você não possui interesses no momento</div>;
    if (interesses.length === 0) return <div>Nenhum interesse encontrado.</div>;


    console.log("Foto de perfil no perfil:", perfil.foto_perfil);
    // Construindo o caminho correto da imagem
    const imageUrl = perfil.foto_perfil
        ? `http://localhost:5000${perfil.foto_perfil}`
        : "/images/default-image.jpg"; // Caminho da imagem padrão caso o usuário não tenha foto



    console.log("URL gerada para a imagem:", imageUrl);

    return (
        <div className={styles.container}>
            {/* Exibindo a imagem de perfil */}
            <img
                src={imageUrl}
                alt={perfil.username}
                className={styles.profileImage}
            />
            <h1 className={styles.nameUser}>{perfil.username}</h1>
            <p className={styles.bioUser}>{perfil.bio}</p>
            <p className={styles.infosUser}>Idioma: {perfil.idioma}</p>
            <p className={styles.infosUser}>Gênero: {perfil.genero}</p>
            <h4 className={styles.infosUser}>País: {perfil.pais}</h4>

            <h2>INTERESSES</h2>
            {interesses.map(interesse => (
                <div key={interesse.id} className={styles.interesses}>
                    <p>{interesse.interesse}</p>
                </div>
            ))}

            {userIdLogado && (
                <button className="mt-4 bg-blue-500 text-white p-2 rounded">Editar Perfil</button>
            )}

            {userIdLogado && (
                <button className="mt-4 bg-blue-500 text-white p-2 rounded" onClick={() => navigate('/')}>
                    Home
                </button>
            )}
        </div>
    );
}

export default Perfil;
