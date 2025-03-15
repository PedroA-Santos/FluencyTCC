import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/usuario";

const useLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", senha: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(() => {
        // Recupera os dados do usuário armazenados no sessionStorage
        const savedUser = sessionStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    // Atualiza os campos de credenciais conforme o usuário digita
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    // Autenticação do usuário
    const handleLogin = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("user", JSON.stringify(data.user));
                navigate(from, { replace: true });
            } else {
                setError(data.message || "Credenciais incorretas.");
            }
        } catch (err) {
            setError("Erro ao conectar com o servidor.");
            console.error("Erro na autenticação:", err);
        } finally {
            setLoading(false);
        }
    };

    // Logout do usuário
    const handleLogout = () => {
        setUser(null);
        setCredentials({ email: "", senha: "" });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        navigate("/login");
    };

    // Verifica a sessão ao carregar a aplicação
    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (token) {
            fetch(`${API_URL}/me`, {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.user) {
                        setUser(data.user);
                        sessionStorage.setItem("user", JSON.stringify(data.user));
                    } else {
                        handleLogout();
                    }
                })
                .catch(() => handleLogout());
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
