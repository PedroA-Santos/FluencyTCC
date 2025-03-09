import axios from 'axios';
import { useState } from 'react';

const useCadastroUsuario = () => {

    console.log("🔹 Hook useCadastroUsuario1 está sendo executado");
    const [user, setUser] = useState({
        email: '',
        senha: '',
        idioma_nativo_id: '',
        genero_id: '',
        data_nascimento: '',
        pais_origem_id: ''
    });

    const [userId, setUserId] = useState(null); // Novo estado para armazenar o ID do usuário
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        console.log("🔹 handleSubmit foi chamado");


        try {

            const res = await axios.post(`http://localhost:5000/usuario/step1`, user);

            setError(false);
            setSuccess("Cadastrado com sucesso")
            setUserId(res.data.id);
            console.log("Resposta da API:", res.data);




            setUser({
                email: '', senha: '', idioma_nativo_id: '', genero_id: '', data_nascimento: '',
                pais_origem_id: ''
            });


        } catch (err) {
            setError(err.response?.data?.message || "Erro ao cadastrar usuário.");
            setUserId(null)
            console.log("Erro ao cadastrar usuário:", err);

        } finally {
            setLoading(false)
        }
    };

    return { user, userId, loading, success, error, handleChange, handleSubmit };
};

export default useCadastroUsuario;
