import React from 'react';
import useCadastroUsuario from '../../hooks/useCadastroUsuario';


function Usuario() {
    const { user, loading, success, error, handleChange, handleSubmit } = useCadastroUsuario();

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Cadastro de Usuário</h2>

            {success && <p style={{ color: 'green' }}>{success}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Senha:</label>
                    <input
                        type="password"
                        name="senha"
                        value={user.senha}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Bio:</label>
                    <textarea
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <label>Foto de Perfil (URL):</label>
                    <input
                        type="text"
                        name="foto_perfil"
                        value={user.foto_perfil}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px' }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    {loading ? "Cadastrando..." : "Cadastrar"}
                </button>
            </form>
        </div>
    );
};



export default Usuario;