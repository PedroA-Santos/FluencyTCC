import useCadastroUsuario from '../../hooks/useCadastroUsuario';
import useListIdiomas from '../../hooks/useListIdiomas';
import useListGeneros from '../../hooks/useListGenero';  // Importando o hook de gêneros

function Usuario() {
    const { user, loading, success, error, handleChange, handleSubmit } = useCadastroUsuario();
    const { idiomas, loading: loadingIdiomas, error: errorIdiomas } = useListIdiomas();
    const { generos, loading: loadingGeneros, error: errorGeneros } = useListGeneros();  // Usando o hook de gêneros

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Cadastro de Usuário</h2>

            {success && <p style={styles.success}>{success}</p>}
            {error && <p style={styles.error}>{error}</p>}
            {errorIdiomas && <p style={styles.error}>Erro ao carregar idiomas: {errorIdiomas}</p>}
            {errorGeneros && <p style={styles.error}>Erro ao carregar gêneros: {errorGeneros}</p>}  {/* Exibindo erro dos gêneros */}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                        autoComplete="username"
                        style={styles.input}
                    />
                </div>

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
                    <label htmlFor="bio">Bio:</label>
                    <textarea
                        id="bio"
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        style={{ ...styles.input, height: '80px' }}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label htmlFor="foto_perfil">Foto de Perfil (URL):</label>
                    <input
                        type="text"
                        id="foto_perfil"
                        name="foto_perfil"
                        value={user.foto_perfil}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>

                {/* Seleção de Idioma (Carregado do Hook) */}
                <div style={styles.inputGroup}>
                    <label htmlFor="idioma">Idioma:</label>
                    <select
                        id="idioma"
                        name="idioma_nativo_id"  // Alterado para o nome correto
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

                {/* Seleção de Gênero (Carregado do Hook) */}
                <div style={styles.inputGroup}>
                    <label htmlFor="genero">Gênero:</label>
                    <select
                        id="genero"
                        name="genero_id"  // Alterado para o nome correto
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

                <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}>
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

export default Usuario;
