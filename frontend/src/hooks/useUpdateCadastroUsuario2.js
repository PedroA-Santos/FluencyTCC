import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const useUpdateCadastroUsuario = (id) => {
    const [user, setUser] = useState({
        username: "",
        bio: "",
        foto_perfil: "",
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axios.put(`http://localhost:5000/usuario/step2/${id}`, user);
            setSuccess("Informações atualizadas com sucesso!");
            setUser({ username: "", bio: "", foto_perfil: "" });
            navigate("/")

        } catch (err) {
            setError(err.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, success, error, handleChange, handleSubmit };
};

export default useUpdateCadastroUsuario;
