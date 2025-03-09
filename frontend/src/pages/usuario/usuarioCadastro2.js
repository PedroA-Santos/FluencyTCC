import { useParams } from "react-router-dom";
import useUpdateCadastroUsuario from "../../hooks/useUpdateCadastroUsuario2"; // Certifique-se de que o hook está correto
import { useState } from "react";

function UsuarioCadastro2() {
    const { id } = useParams();  // ✅ Captura o ID da URL corretamente
    const { user, handleChange, handleSubmit, loading, success, error } = useUpdateCadastroUsuario(id);  // Passa o ID para o hook
    const [imagem, setImagem] = useState(null); // Estado para armazenar a imagem

    if (!id || id === null) {
        return <p>Erro: ID do usuário não encontrado.</p>;  // Verifica se o ID existe na URL
    }

    // Manipula a seleção da imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(URL.createObjectURL(file));  // Cria um preview da imagem
        }
    };

    return (
        <div style={styles.container}>
            <h2>Atualizar Perfil</h2>

            {success && <p style={styles.success}>{success}</p>}
            {error && <p style={styles.error}>{error}</p>}
            {loading && <p>Carregando...</p>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Nome de Usuário:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username || ''}  // Garante que 'username' esteja sempre definido
                        onChange={handleChange}
                        required
                        placeholder="Nome de Usuário"
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label>Bio:</label>
                    <input
                        type="text"
                        name="bio"
                        value={user.bio || ''}  // Garante que 'bio' esteja sempre definido
                        onChange={handleChange}
                        placeholder="Bio"
                    />
                </div>

                {/* Novo campo para imagem */}
                <div style={styles.inputGroup}>
                    <label>Foto de Perfil:</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        style={styles.input} 
                    />
                    {imagem && <img src={imagem} alt="Preview" style={styles.preview} />} 
                </div>

                <button type="submit" style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}>
                    Salvar Alterações
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
    },
    preview: {
        width: '100%',
        maxHeight: '150px',
        objectFit: 'cover',
        marginTop: '10px',
        borderRadius: '5px'
    }
};

export default UsuarioCadastro2;
