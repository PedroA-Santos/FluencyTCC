import useCadastroUsuario1 from '../../hooks/useCadastroUsuario1';
import useListIdiomas from '../../hooks/useListIdiomas';
import useListGeneros from '../../hooks/useListGenero';
import useListPaises from '../../hooks/useListPaises';
import styles from './usuarioCadastro1.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function UsuarioCadastro1() {
    const { user, userId, loading, success, error, handleChange, handleSubmit } = useCadastroUsuario1();
    const { idiomas, loading: loadingIdiomas, error: errorIdiomas } = useListIdiomas();
    const { generos, loading: loadingGeneros, error: errorGeneros } = useListGeneros();
    const { paises, loading: loadingPaises, error: errorPaises } = useListPaises();

    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            console.log("🔹 Redirecionando para:", `/usuarioCadastro2/${userId}`);
            setTimeout(() => navigate(`/usuarioCadastro2/${userId}`), 500);
        }
    }, [userId, navigate]);

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Cadastro de Usuário</h2>

            {success && <p className={styles.sucessMessage}>{success}</p>}
            {error && <p className={styles.error}>{error}</p>}
            {errorIdiomas && <p className={styles.error}>Erro ao carregar idiomas: {errorIdiomas}</p>}
            {errorGeneros && <p className={styles.error}>Erro ao carregar gêneros: {errorGeneros}</p>}
            {errorPaises && <p className={styles.error}>Erro ao carregar países: {errorPaises}</p>}

            <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                    />
                    <label htmlFor="email">Email</label>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={user.senha}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                    />
                    <label htmlFor="senha">Senha</label>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="date"
                        id="data_nascimento"
                        name="data_nascimento"
                        value={user.data_nascimento}
                        onChange={handleChange}
                        required
                    />
                    <label htmlFor="data_nascimento">Data de Nascimento</label>
                </div>

                <div className={styles.inputGroup}>
                    <select
                        id="idioma"
                        name="idioma_nativo_id"
                        value={user.idioma_nativo_id}
                        onChange={handleChange}
                        disabled={loadingIdiomas}
                    >
                        <option value="">Selecione um Idioma Nativo</option>
                        {idiomas.map((idioma) => (
                            <option key={idioma.id} value={idioma.id}>
                                {idioma.idioma}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="idioma">Idioma</label>
                </div>

                <div className={styles.inputGroup}>
                    <select
                        name="pais_origem_id"
                        id="paises"
                        value={user.pais_origem_id}
                        onChange={handleChange}
                        disabled={loadingPaises}
                    >
                        <option value="">Selecione um País</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>
                                {pais.nome}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="paises">Seu País de Origem</label>
                </div>

                <div className={styles.inputGroup}>
                    <select
                        id="genero"
                        name="genero_id"
                        value={user.genero_id}
                        onChange={handleChange}
                        disabled={loadingGeneros}
                    >
                        <option value="">Selecione um gênero</option>
                        {generos.map((genero) => (
                            <option key={genero.id} value={genero.id}>
                                {genero.genero}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="genero">Gênero</label>
                </div>

                <button type="submit" disabled={loading} className={styles.button}>
                    {loading ? "Cadastrando..." : "Próxima Etapa"}
                </button>
            </form>
        </div>
    );
}

export default UsuarioCadastro1;
