import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook para navegação

const useLogin = () => {

    // esse estado gerencia o email e a senha passados pelo usuário no form
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); // para quando estiver em andamento a requisição
    const [error, setError] = useState("");
    const [user, setUser] = useState(null);
    // esse estado vai ser responsável por armazenar os dados do usuário autenticado

    const navigate = useNavigate(); // Inicializa o hook para navegação

    // Atualiza os campos de credenciais recebendo o que o usuário esta inserindo 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    // Essa função faz a requisição no back para autenticar o usuário
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // aq ela envia as credenciais preenchidas pelo usuário através de um post para a rota de login no back
            const response = await fetch("http://localhost:5000/usuario/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
            });

            // se n der erro aq ele salva o token no localStorage(onde armazena dados no dispositivo do usuário) e redireciona para a home
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setError("");


                localStorage.setItem("token", data.token);


                navigate("/");


            } else {
                //se der erro cai aqui
                const errorData = await response.json();
                setError(errorData.message || "Credenciais incorretas.");
            }
        } catch (err) {

            //se der b.o com o back cai aq
            setError("Erro ao conectar com o servidor.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Realiza o logout
    const handleLogout = () => {
        setUser(null);
        setCredentials({ email: "", password: "" });
        localStorage.removeItem("token"); // Remove o token
    };

    return {
        credentials,
        user,
        loading,
        error,
        handleChange,
        handleLogin,
        handleLogout,
    };
};

export default useLogin;
