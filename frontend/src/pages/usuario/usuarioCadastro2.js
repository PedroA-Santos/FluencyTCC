import { useParams } from "react-router-dom";
import { useState } from "react";
import useUpdateCadastroUsuario from "../../hooks/useUpdateCadastroUsuario2";
import useListInteresses from "../../hooks/useListInteresses";
import styles from "./usuarioCadastro2.module.css";

function UsuarioCadastro2() {
    const { id } = useParams();
    const { user, handleChange, handleSubmit, loading, success, error, handleImageChange } = useUpdateCadastroUsuario(id);
    const { interesses, loading: loadingInteresses, error: errorInteresses } = useListInteresses();

    const [interessesSelecionados, setInteressesSelecionados] = useState([]);

    if (!id || id === null) {
        return <p>Erro: ID do usuário não encontrado.</p>;
    }

    const toggleInteresse = (interesseId) => {
        setInteressesSelecionados((prevSelecionados) => {
            const updatedInteresses = prevSelecionados.includes(interesseId)
                ? prevSelecionados.filter((id) => id !== interesseId)
                : [...prevSelecionados, interesseId];

            return updatedInteresses;
        });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Atualizar Perfil</h2>

            {success && <p className={styles.success}>{success} Redirecionando...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {loading && <p>Carregando...</p>}
            {errorInteresses && <p className={styles.error}>Erro ao carregar interesses: {errorInteresses}</p>}

            <form onSubmit={(e) => handleSubmit(e, interessesSelecionados)} className={styles.form}>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        name="username"
                        value={user.username || ""}
                        onChange={handleChange}
                        required
                        placeholder="Nome de Usuário"
                    />
                    <label>Nome de Usuário</label>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        name="bio"
                        value={user.bio || ""}
                        onChange={handleChange}
                        placeholder="Bio"
                    />
                    <label>Bio</label>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="file"
                        name="foto_perfil"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <label>Foto de Perfil</label>
                </div>

                <div className={styles.inputGroup}>
                    <label>Interesses:</label>
                    <div className={styles.interessesContainer}>
                        {loadingInteresses ? (
                            <p>Carregando interesses...</p>
                        ) : (
                            interesses.map((interesse) => (
                                <button
                                    key={interesse.id}
                                    type="button"
                                    className={`${styles.interesseButton} ${interessesSelecionados.includes(interesse.id) ? styles.selected : ""}`}
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
                    <div className={styles.selectedInteresses}>
                        <p>Interesses Selecionados:</p>
                        <div className={styles.selectedTagsContainer}>
                            {interessesSelecionados.map((id) => (
                                <span key={id} className={styles.selectedTag}>
                                    {interesses.find((item) => item.id === id)?.interesse}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" className={styles.button} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
        </div>
    );
}

export default UsuarioCadastro2;
