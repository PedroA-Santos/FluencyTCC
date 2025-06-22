import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useUpdateCadastroUsuario = (id) => {
    // Estado para armazenar os dados do usuário
    const [user, setUser] = useState({
        username: "",
        bio: "",
        foto_perfil: null,
    });

    // Estado para armazenar os interesses selecionados
    const [interesses, setInteresses] = useState([]);

    // Estados para controle de carregamento, sucesso e erro
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // Hook do React Router para redirecionamento
    const navigate = useNavigate();

    // Função para atualizar os campos de texto do usuário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Função para atualizar a imagem de perfil do usuário
    const handleImageChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setUser((prevUser) => ({
                ...prevUser,
                [name]: files[0], // Salva o arquivo da imagem
            }));
        }
    };

    // Atualiza a lista de interesses quando o usuário escolhe novos
    const handleInteressesChange = (selectedInteresses) => {
        setInteresses(selectedInteresses);
    };

    // Função para enviar os dados do formulário para o backend
    const handleSubmit = async (e, interessesSelecionados) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("username", user.username);
        formData.append("bio", user.bio);
        if (user.foto_perfil) {
            formData.append("foto_perfil", user.foto_perfil); // Adiciona a imagem ao FormData
        }

        // Adiciona os interesses ao FormData
        interessesSelecionados.forEach((interesse, index) => {
            formData.append(`interesses[${index}]`, interesse);
        });

        try {
            // Envia os dados via requisição PUT para atualizar o perfil do usuário
            const res = await axios.put(`http://localhost:5000/usuario/step2/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Atualização bem-sucedida!", res.data);
            setSuccess("Informações atualizadas com sucesso!");

            // Aguarda 2 segundos e redireciona o usuário para a página de login
            setTimeout(() => {
                navigate('/login');
            }, 1000);

            // Reseta os campos do formulário
            setUser({ username: "", bio: "", foto_perfil: null });
            setInteresses([]);

        } catch (err) {
            // Captura erros e exibe a mensagem apropriada
            setError(err.response?.data?.message || "Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    return { user, interesses, handleChange, handleSubmit, handleImageChange, handleInteressesChange, loading, success, error };
};

export default useUpdateCadastroUsuario;
