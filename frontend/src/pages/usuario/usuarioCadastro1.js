import useCadastroUsuario1 from '../../hooks/useCadastroUsuario1';
import useListIdiomas from '../../hooks/useListIdiomas';
import useListGeneros from '../../hooks/useListGenero';
import useListPaises from '../../hooks/useListPaises';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function UsuarioCadastro1() {
    const { user, userId, loading, success, error, handleChange, handleSubmit } = useCadastroUsuario1();
    const { idiomas, loading: loadingIdiomas, error: errorIdiomas } = useListIdiomas();
    const { generos, loading: loadingGeneros, error: errorGeneros } = useListGeneros();
    const { paises, loading: loadingPaises, error: errorPaises } = useListPaises();
    const navigate = useNavigate();

    // ✅ Redireciona para a próxima página quando o ID do usuário for atualizado
    useEffect(() => {
        if (userId) {
            console.log("🔹 Redirecionando para:", `/usuarioCadastro2/${userId}`);
            setTimeout(() => navigate(`/usuarioCadastro2/${userId}`), 500);
        }
    }, [userId, navigate]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Cadastro de Usuário</h2>

            {success && <p style={styles.success}>{success}</p>}
            {error && <p style={styles.error}>{error}</p>}
            {errorIdiomas && <p style={styles.error}>Erro ao carregar idiomas: {errorIdiomas}</p>}
            {errorGeneros && <p style={styles.error}>Erro ao carregar gêneros: {errorGeneros}</p>}
            {errorPaises && <p style={styles.error}>Erro ao carregar países: {errorPaises}</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={user.senha}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="data_nascimento">Data de Nascimento</label>
                    <input type="date"
                        id="data_nascimento"
                        name="data_nascimento"
                        value={user.data_nascimento}
                        onChange={handleChange}
                        required
                        style={styles.input} />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="idioma">Idioma:</label>
                    <select
                        id="idioma"
                        name="idioma_nativo_id"
                        value={user.idioma_nativo_id}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loadingIdiomas}
                    >
                        <option value="">Selecione um idioma</option>
                        {idiomas.map((idioma) => (
                            <option key={idioma.id} value={idioma.id}>
                                {idioma.idioma}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="paises">Seu Pais de Origem</label>
                    <select
                        name="pais_origem_id"
                        id="paises"
                        value={user.pais_origem_id}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loadingPaises}>

                        <option value="">Selecione um País</option>
                        {paises.map((pais) => (
                            <option key={pais.id} value={pais.id}>
                                {pais.nome}
                            </option>
                        ))}

                    </select>
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="genero">Gênero:</label>
                    <select
                        id="genero"
                        name="genero_id"
                        value={user.genero_id}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loadingGeneros}
                    >
                        <option value="">Selecione um gênero</option>
                        {generos.map((genero) => (
                            <option key={genero.id} value={genero.id}>
                                {genero.genero}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="button" onClick={handleSubmit} disabled={loading} style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}>
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>

            </form>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '400px',
        margin: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
    },
    title: {
        textAlign: 'center',
        marginBottom: '15px'
    },
    success: {
        color: 'green',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    error: {
        color: 'red',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroup: {
        marginBottom: '10px',
        display: 'flex',
        flexDirection: 'column'
    },
    input: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px'
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '5px',
        fontSize: '16px'
    }
};

export default UsuarioCadastro1;
