import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserPlus } from 'react-icons/fa';
import useEditPerfil from "../../hooks/useEditPerfil";
import useListInteresses from "../../hooks/useListInteresses";
import styles from "./usuarioEditar.module.css";

function UsuarioEditar() {
    const { id } = useParams();
    const { user, handleChange, handleSubmit, loading, success, error, handleImageChange } = useEditPerfil(id);
    const { interesses, loading: loadingInteresses, error: errorInteresses } = useListInteresses();

    const [interessesSelecionados, setInteressesSelecionados] = useState([]);
    const [image, setImage] = useState(null);
    const imageUrl = user.foto_perfil
        ? `http://localhost:5000${user.foto_perfil}`
        : "/images/default-image.jpg";

    // Função para configurar a imagem de perfil pré-existente ou a nova imagem selecionada
    useEffect(() => {
        if (user && user.foto_perfil) {
            if (typeof user.foto_perfil === "string") {
                const isBase64 = user.foto_perfil.startsWith("data:image");
                const fullPath = isBase64 ? user.foto_perfil : `http://localhost:5000${user.foto_perfil}`;
                setImage(fullPath);
            }
        }
    
        if (user && user.interesses) {
            setInteressesSelecionados(user.interesses.map((interesse) => interesse.id));
        }
    }, [user]);
    


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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                handleImageChange(event);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Perfil</h2>

            {success && <p>{success} Redirecionando...</p>}
            {error && <p>{error}</p>}
            {loading && <p>Carregando...</p>}
            {errorInteresses && <p>Erro ao carregar interesses: {errorInteresses}</p>}

            <form onSubmit={(e) => handleSubmit(e, interessesSelecionados)} className={styles.form}>
                <div className={styles.iinputFileContainer}>
                    <input
                        type="file"
                        id="fileInput"
                        name="foto_perfil"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className={styles.fileInput}
                    />
                    <p>Foto de Perfil</p>
                    <label htmlFor="fileInput" className={styles.previewImage}>
                        {image ? (
                            <img src={image} alt="Pré-visualização" width="100" />


                        ) : (
                            <span className={styles.span}>
                                <FaUserPlus size={50} color="#ffff" />
                            </span>
                        )}
                    </label>
                </div>

                <div className={styles.inputGroup}>
                    <label>Nome de Usuário</label>
                    <input
                        type="text"
                        name="username"
                        value={user.username || ""}
                        onChange={handleChange}
                        required
                        placeholder="Nome de Usuário"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Bio</label>
                    <input
                        type="text"
                        name="bio"
                        value={user.bio || ""}
                        onChange={handleChange}
                        placeholder="Bio"
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label>Interesses:</label>
                    <div className="interessesContainer">
                        {loadingInteresses && <p>Carregando interesses...</p>}
                        {interesses.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={`${styles.interesseButton} ${interessesSelecionados.includes(item.id) ? styles.selected : ''}`}
                                onClick={() => toggleInteresse(item.id)}
                            >
                                {item.interesse}
                            </button>
                        ))}
                    </div>
                </div>

                {interessesSelecionados.length > 0 && (
                    <div className={styles.interessesSelecionadosContainer}>
                        <h3 className={styles.tituloInteressesSelecionados}>Interesses Selecionados:</h3>
                        <div className={styles.listaInteressesSelecionados}>
                            {interessesSelecionados.map((id) => (
                                <span key={id} className={styles.interesseSelecionado}>
                                    {interesses.find((item) => item.id === id)?.interesse}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" disabled={loading} className={styles.buttonSubmit}>
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
        </div>
    );
}

export default UsuarioEditar;
