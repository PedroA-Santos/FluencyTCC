import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaUserPlus } from 'react-icons/fa';
import useEditPerfil from "../../hooks/useEditPerfil";
import useListInteresses from "../../hooks/useListInteresses";
import useListIdiomas from '../../hooks/useListIdiomas';
import useListInteressesUsuario from '../../hooks/useListInteressesUsuario';
import styles from "./usuarioEditar.module.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useListIdiomasUsuario from "../../hooks/useListIdiomasUsuario";
import { useMenu } from "../../context/menuContext";
import Contatos from "../../components/Contatos";
import useMobile from "../../hooks/useMobile";

function UsuarioEditar() {
    const { id } = useParams();
    const { user, handleChange, handleSubmit, loading, success, error, handleImageChange } = useEditPerfil(id);
    const { interesses, loading: loadingInteresses, error: errorInteresses } = useListInteresses();
    const { interesses: interessesUsuario, loading: loadingInteressesUsuario, error: errorInteressesUsuario } = useListInteressesUsuario(id);
    const { idiomas, loading: loadingIdiomas, error: errorIdiomas } = useListIdiomas();
    const { idiomas: idiomasUsuario, loading: loadingIdiomasUsuario, error: errorIdiomasusuario } = useListIdiomasUsuario(id);
    const navigate = useNavigate();
    const { menuAberto, setMenuAberto, menuToggleRef } = useMenu();
    const isMobile = useMobile();

    const [interessesSelecionados, setInteressesSelecionados] = useState([]);
    const [idiomasSelecionados, setIdiomasSelecionados] = useState([]);
    const [image, setImage] = useState(null);
    const imageUrl = user.foto_perfil
        ? `http://localhost:5000${user.foto_perfil}`
        : "/images/default-image.jpg";

    useEffect(() => {
        console.log("🔹 Dados de idiomas recebidos:", {
            idiomas,
            loadingIdiomas,
            errorIdiomas,
            idiomasUsuario,
            loadingIdiomasUsuario,
            errorIdiomasusuario
        });
    }, [idiomas, loadingIdiomas, errorIdiomas, idiomasUsuario, loadingIdiomasUsuario, errorIdiomasusuario]);

    useEffect(() => {
        const tempId = sessionStorage.getItem("userId");

        if (id !== tempId) {
            toast.error("Erro você não tem acesso!");
            navigate("/");
        }
    }, [id, navigate]);

    useEffect(() => {
        if (user && user.foto_perfil) {
            if (typeof user.foto_perfil === "string") {
                const isBase64 = user.foto_perfil.startsWith("data:image");
                const fullPath = isBase64 ? user.foto_perfil : `http://localhost:5000${user.foto_perfil}`;
                setImage(fullPath);
            }
        }

        if (interessesUsuario && interessesUsuario.length > 0) {
            setInteressesSelecionados(interessesUsuario.map(i => i.id));
            console.log("🔹 Interesses do usuário:", interessesUsuario);
        }

        if (idiomasUsuario && idiomasUsuario.length > 0) {
            const selectedIds = idiomasUsuario.map(i => String(i.id));
            setIdiomasSelecionados(selectedIds);
            console.log("🔹 Idiomas do usuário:", idiomasUsuario);
            console.log("🔹 Idiomas selecionados:", selectedIds);
        } else {
            console.log("🔹 Nenhum idioma encontrado em idiomasUsuario:", idiomasUsuario);
        }
    }, [interessesUsuario, idiomasUsuario, user]);

    if (!id || id === null) {
        return <p>Erro: ID do usuário não encontrado.</p>;
    }

    const toggleInteresse = (interesseId) => {
        setInteressesSelecionados((prevSelecionados) => {
            const updatedInteresses = prevSelecionados.includes(interesseId)
                ? prevSelecionados.filter((id) => id !== interesseId)
                : [...prevSelecionados, interesseId];
            console.log("🔹 Interesses selecionados após toggle:", updatedInteresses);
            return updatedInteresses;
        });
    };

    const toggleIdioma = (idiomaId) => {
        setIdiomasSelecionados((prevSelecionados) => {
            const idAsString = String(idiomaId);
            const updatedIdiomas = prevSelecionados.includes(idAsString)
                ? prevSelecionados.filter((id) => id !== idAsString)
                : [...prevSelecionados, idAsString];
            console.log("🔹 Idiomas selecionados após toggle:", updatedIdiomas);
            return updatedIdiomas;
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
            {isMobile && (
                <>
                    <button
                        ref={menuToggleRef}
                        className={styles.menuToggle}
                        onClick={() => setMenuAberto((prev) => !prev)}
                    >
                        ☰
                    </button>
                    <div className={`${styles.contatosContainer} ${menuAberto ? styles.menuAberto : ""}`}>
                        <Contatos
                            menuAberto={menuAberto}
                            setMenuAberto={setMenuAberto}
                            menuToggleRef={menuToggleRef}
                        />
                    </div>
                </>
            )}
            {!isMobile && (
                <div className={styles.contatosContainer}>
                    <Contatos />
                </div>
            )}

            <h2 className={styles.title}>Perfil</h2>

            {success && <p>{success} Redirecionando...</p>}
            {error && <p>{error}</p>}
            {loading && <p>Carregando...</p>}
            {errorInteresses && <p>Erro ao carregar interesses: {errorInteresses}</p>}
            {errorIdiomas && <p>Erro ao carregar idiomas: {errorIdiomas}</p>}
            {errorIdiomasusuario && <p>Erro ao carregar idiomas do usuário: {errorIdiomasusuario}</p>}

            <form onSubmit={(e) => handleSubmit(e, interessesSelecionados, idiomasSelecionados)} className={styles.form}>
                <div className={styles.inputFileContainer}>
                    <input
                        type="file"
                        id="fileInput"
                        name="foto_perfil"
                        onChange={handleImageUpload}
                        accept="image/*"
                        className={styles.fileInput}
                    />
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
                    <label className={styles.labelIdiomas}>Selecione os Idiomas:</label>
                    <div className={styles.interessesContainer}>
                        {loadingIdiomas && <p>Carregando idiomas...</p>}
                        {errorIdiomas && <p>Erro ao carregar idiomas: {errorIdiomas}</p>}
                        {!loadingIdiomas && !errorIdiomas && (!idiomas || idiomas.length === 0) && <p>Nenhum idioma disponível.</p>}
                        {idiomas && idiomas.map((item) => {
                            const isSelected = idiomasSelecionados.includes(String(item.id));
                            console.log(`🔹 Renderizando idioma: ${item.nome || item.idioma}, ID: ${item.id}, Selecionado: ${isSelected}`);
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={[styles.interesseButton, isSelected ? styles.selected : ''].join(' ')}
                                    onClick={() => toggleIdioma(item.id)}
                                >
                                    {item.nome || item.idioma}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.idiomasSelecionadosContainer}>
                    <h3 className={styles.tituloIdiomasSelecionados}>Idiomas Selecionados:</h3>
                    <div className={styles.listaIdiomasSelecionados}>
                        {idiomasSelecionados.map((id) => {
                            const idioma = idiomas.find((item) => String(item.id) === String(id));
                            console.log(`🔹 Renderizando idioma selecionado: ${idioma ? (idioma.nome || idioma.idioma) : "Desconhecido"}, ID: ${id}`);
                            return (
                                <span key={id} className={styles.idiomaSelecionado}>
                                    {(idioma && (idioma.nome || idioma.idioma)) || "Idioma desconhecido"}
                                </span>
                            );
                        })}
                    </div>
                </div>



                <div className={styles.inputGroup}>
                    <label className={styles.labelIdiomas}>Selecione os Interesses:</label>
                    <div className={styles.interessesContainer}>
                        {loadingInteresses && <p>Carregando interesses...</p>}
                        {errorInteresses && <p>Erro ao carregar interesses: {errorInteresses}</p>}
                        {!loadingInteresses && !errorInteresses && (!interesses || interesses.length === 0) && <p>Nenhum interesse disponível.</p>}
                        {interesses && interesses.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                className={[styles.interesseButton, interessesSelecionados.includes(String(item.id)) ? styles.selected : ''].join(' ')}
                                onClick={() => toggleInteresse(item.id)}
                            >
                                {item.interesse}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={styles.interessesSelecionadosContainer}>
                    <h3 className={styles.tituloInteressesSelecionados}>Interesses Selecionados:</h3>
                    <div className={styles.listaInteressesSelecionados}>
                        {interessesSelecionados.map((id) => (
                            <span key={id} className={styles.interesseSelecionado}>
                                {interesses.find((item) => String(item.id) === String(id))?.interesse || "Interesse desconhecido"}
                            </span>
                        ))}
                    </div>
                </div>



                <button type="submit" disabled={loading} className={styles.buttonSubmit}>
                    {loading ? "Salvando..." : "Salvar"}
                </button>
            </form>
        </div>
    );
}

export default UsuarioEditar;