import styles from './perfil.module.css';
import usePerfilUsuario from '../../hooks/usePerfilUsuario';
import useListInteressesUsuario from '../../hooks/useListInteressesUsuario';

function Perfil() {
    ///ESTOU USANDO ESSE HOOK PARA PEGAR OS DADOS DO USUARIO E MOSTRAR NO PERFIL
    const { perfil, loading, error } = usePerfilUsuario();
    //ESTOU USANDO ESSE HOOK PARA PEGAR OS INTERESSES DO USUARIO E MOSTRAR NO PERFIL
    const { interesses, error: errorInteresses } = useListInteressesUsuario();
    // Recupera o usuário logado da sessionStorage
    const userString = sessionStorage.getItem("user");
    let userIdLogado = null;

    if (userString) {
        const user = JSON.parse(userString);
        userIdLogado = user?.id;
    }

    if (loading) return <div>Carregando...</div>
    if (error) return <div>{error}</div>
    if (!perfil) return <div>Perfil não encontrado.</div>
    if (errorInteresses) return <div>{errorInteresses}</div>
    return (
        <div className={styles.container}>
            <img src={perfil.foto_perfil} alt={perfil.username} className={styles.profileImage} />
            <h1 className={styles.nameUser}>{perfil.username}</h1>
            <p className={styles.bioUser}>{perfil.bio}</p>
            <p className={styles.infosUser}>Idioma:{perfil.idioma}</p>
            <p className={styles.infosUser}>Gênero:{perfil.genero}</p>
            <h4 className={styles.infosUser}>País:{perfil.pais}</h4>

            <h2>INTERESSES</h2>
            {interesses.map(interesse => (
                <div key={interesse.id} className={styles.interesses}>
                    <p>{interesse.interesse}</p>
                </div>
            ))}

            {perfil.id === userIdLogado && (
                <button className="mt-4 bg-blue-500 text-white p-2 rounded">Editar Perfil</button>
            )}
        </div>
    )
}

export default Perfil;