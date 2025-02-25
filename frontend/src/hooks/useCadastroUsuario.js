import axios from 'axios';
import { useState } from 'react';

const useCadastroUsuario = () => {
    const [user, setUser] = useState({
        username: '',
        email: '',
        senha: '',
        bio: '',
        foto_perfil: ''
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Atualiza os campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    // Envia os dados do usuário para a API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await axios.post(`http://localhost:5000/usuario`, user);

            setSuccess("Usuário cadastrado com sucesso!");
            setUser({ username: '', email: '', senha: '', bio: '', foto_perfil: '' }); // Limpa os campos
        } catch (err) {
            setError(err.response?.data?.message || "Erro ao cadastrar usuário.");
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        success,
        error,
        handleChange,
        handleSubmit
    };
};

export default useCadastroUsuario;
