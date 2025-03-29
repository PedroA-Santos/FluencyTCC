import { useParams } from "react-router-dom";
import { useState } from "react";
import useUpdateCadastroUsuario from "../../hooks/useUpdateCadastroUsuario2";
import useListInteresses from "../../hooks/useListInteresses";

function UsuarioCadastro2() {
    const { id } = useParams();
    const { user, handleChange, handleSubmit, loading, success, error, handleImageChange } = useUpdateCadastroUsuario(id);
    const { interesses, loading: loadingInteresses, error: errorInteresses } = useListInteresses();

    const [interessesSelecionados, setInteressesSelecionados] = useState([]);

    if (!id || id === null) {
        return <p>Erro: ID do usuário não encontrado.</p>;
    }

    // Alternar seleção de interesses ao clicar
    const toggleInteresse = (interesseId) => {
        setInteressesSelecionados((prevSelecionados) => {
            const updatedInteresses = prevSelecionados.includes(interesseId)
                ? prevSelecionados.filter((id) => id !== interesseId)
                : [...prevSelecionados, interesseId];

            // Adicionando o log para depuração
            console.log('Interesses Selecionados:', updatedInteresses); // Aqui está o log

            return updatedInteresses;
        });
    };
    return (
        <div style={styles.container}>
            <h2>Atualizar Perfil</h2>

            {success && (
                <p style={styles.success}>
                    {success} Redirecionando para o login...
                </p>
            )}
            {error && <p style={styles.error}>{error}</p>}
            {loading && <p>Carregando...</p>}
            {errorInteresses && <p style={styles.error}>Erro ao carregar interesses: {errorInteresses}</p>}

            <form onSubmit={(e) => handleSubmit(e, interessesSelecionados)} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Nome de Usuário:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username || ''}
                        onChange={handleChange}
                        required
                        placeholder="Nome de Usuário"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Bio:</label>
                    <input
                        type="text"
                        name="bio"
                        value={user.bio || ''}
                        onChange={handleChange}
                        placeholder="Bio"
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Foto de Perfil:</label>
                    <input
                        type="file"
                        name="foto_perfil"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={styles.input}
                    />
                </div>

                {/* Novo sistema de seleção de interesses */}
                <div style={styles.inputGroup}>
                    <label>Interesses:</label>
                    <div style={styles.interessesContainer}>
                        {loadingInteresses ? (
                            <p>Carregando interesses...</p>
                        ) : (
                            interesses.map((interesse) => (
                                <button
                                    key={interesse.id}
                                    type="button"
                                    style={{
                                        ...styles.interesseButton,
                                        backgroundColor: interessesSelecionados.includes(interesse.id) ? "#007bff" : "#f0f0f0",
                                        color: interessesSelecionados.includes(interesse.id) ? "#fff" : "#333",
                                    }}
                                    onClick={() => toggleInteresse(interesse.id)}
                                >
                                    {interesse.interesse}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Mostrar interesses selecionados */}
                {interessesSelecionados.length > 0 && (
                    <div style={styles.selectedInteresses}>
                        <p>Interesses Selecionados:</p>
                        {interessesSelecionados.map((id) => (
                            <span key={id} style={styles.selectedTag}>
                                {interesses.find((item) => item.id === id)?.interesse}
                            </span>
                        ))}
                    </div>
                )}

                <button type="submit" style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}>Salvar</button>
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
    interessesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '5px'
    },
    interesseButton: {
        padding: '8px 12px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        transition: '0.3s',
    },
    selectedInteresses: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#e6f7ff',
        borderRadius: '5px',
    },
    selectedTag: {
        display: 'inline-block',
        backgroundColor: '#007bff',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '15px',
        margin: '5px',
        fontSize: '12px'
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

export default UsuarioCadastro2;
