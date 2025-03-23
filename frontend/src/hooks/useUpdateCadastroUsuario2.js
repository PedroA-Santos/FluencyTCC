import { useState } from "react";
import axios from "axios";

const useUpdateCadastroUsuario = (id) => {
    const [user, setUser] = useState({
        username: "",
        bio: "",
        foto_perfil: null,  // Inicializa como null porque vai ser um arquivo
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

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
                [name]: files[0],  // Armazena o arquivo da imagem
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("bio", user.bio);
        if (user.foto_perfil) {
            formData.append("foto_perfil", user.foto_perfil); // Anexa o arquivo de imagem
        }

        try {
            const res = await axios.put(`http://localhost:5000/usuario/step2/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Indica que está enviando um arquivo
                },
            });
            setSuccess("Informações atualizadas com sucesso!");
            setUser({ username: "", bio: "", foto_perfil: null });
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    return { user, handleChange, handleSubmit, handleImageChange, loading, success, error };
};

export default useUpdateCadastroUsuario;
