import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useEditPerfil = (id) => {
    const [user, setUser] = useState({
        username: "",
        bio: "",
        foto_perfil: null,
        idioma_nativo: "",
        idiomas_aprendendo: [] // <- adicionamos aqui
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setUser((prevUser) => ({
                ...prevUser,
                [name]: files[0],
            }));
        }
    };

    const toggleIdiomaAprendizado = (idiomaId) => {
        setUser((prev) => {
            const existe = prev.idiomas_aprendendo.includes(idiomaId);
            return {
                ...prev,
                idiomas_aprendendo: existe
                    ? prev.idiomas_aprendendo.filter((id) => id !== idiomaId)
                    : [...prev.idiomas_aprendendo, idiomaId],
            };
        });
    };

    const handleSubmit = async (e, interessesSelecionados, idiomasSelecionados) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("bio", user.bio);
        formData.append("idioma_nativo", user.idioma_nativo);

        if (user.foto_perfil) {
            formData.append("foto_perfil", user.foto_perfil);
        }

        // Interesses (ainda necessários na atualização)
        interessesSelecionados.forEach((interesse, index) => {
            formData.append(`interesses[${index}]`, interesse);
        });

        // Idiomas aprendendo
        idiomasSelecionados.forEach((idiomaId, index) => {
            formData.append(`idiomas[${index}]`, idiomaId);
        });

        try {
            const res = await axios.put(`http://localhost:5000/usuario/step2/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess("Informações atualizadas com sucesso!");

            setTimeout(() => {
                navigate('/');
            }, 2000);

            // Reseta somente os campos editáveis
            setUser((prev) => ({
                ...prev,
                username: "",
                bio: "",
                foto_perfil: null,
                idioma_nativo: "",
                idiomas_aprendendo: []
            }));

        } catch (err) {
            setError(err.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    // Carregar dados iniciais do usuário (sem interesses, como você pediu)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/usuario/${id}`);
                const data = res.data;

                setUser({
                    username: data.username || "",
                    bio: data.bio || "",
                    foto_perfil: data.foto_perfil || null,
                    idioma_nativo: data.idioma_nativo || "",
                    idiomas_aprendendo: data.idiomas_aprendendo?.map((idioma) => idioma.id) || []
                });
            } catch (err) {
                console.error("Erro ao buscar usuário:", err);
            }
        };

        fetchUser();
    }, [id]);

    return {
        user,
        handleChange,
        handleSubmit,
        handleImageChange,
        toggleIdiomaAprendizado, // você pode usar no componente
        loading,
        success,
        error
    };
};

export default useEditPerfil;
