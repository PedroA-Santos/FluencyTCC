import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const useLogin = () => {
    // Estado para armazenar as credenciais do usuário
    const [credentials, setCredentials] = useState({ email: "", senha: "" });
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [error, setError] = useState(""); // Estado para armazenar mensagens de erro
    const [user, setUser] = useState(null); // Estado para armazenar o usuário autenticado

    const navigate = useNavigate(); // Hook para navegação
    const location = useLocation(); // Hook para capturar a URL anterior

    // Obtém a página para onde o usuário deveria ser redirecionado após o login
    const from = location.state?.from?.pathname || "/";

    // Atualiza os campos de credenciais conforme o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    // Função para autenticar o usuário
    const handleLogin = async (e) => {
        e.preventDefault();

        // Evita múltiplos envios enquanto a requisição está em andamento
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            // Envia as credenciais para o backend
            const response = await fetch("http://localhost:5000/usuario/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setError("");

                // Armazena o token no sessionStorage para maior segurança
                sessionStorage.setItem("token", data.token);

                // Redireciona para a página pretendida
                navigate(from, { replace: true });
            } else {
                // Tratamento de erro caso a resposta do servidor seja inválida
                try {
                    const errorData = await response.json();
                    setError(errorData.message || "Credenciais incorretas.");
                } catch {
                    setError("Erro inesperado ao processar a resposta do servidor.");
                }
            }
        } catch (err) {
            setError("Erro ao conectar com o servidor.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Função para realizar o logout do usuário
    const handleLogout = () => {
        setUser(null);
        setCredentials({ email: "", senha: "" });
        sessionStorage.removeItem("token"); // Remove o token armazenado
    };

    // Verifica se há um usuário autenticado ao carregar a aplicação
    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (token) {
            fetch("http://localhost:5000/usuario/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })
                .then((res) => res.json())
                .then((data) => setUser(data.user))
                .catch(() => handleLogout()); // Se o token for inválido, desloga o usuário
        }
    }, []);

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
