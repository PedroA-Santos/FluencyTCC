import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/usuario";

const useLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", senha: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [user, setUser] = useState(() => {
        const savedUserId = sessionStorage.getItem("userId");
        return savedUserId ? { id: savedUserId } : null;
    });

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

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
                setUser({ id: data.user.id });  // só o id
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("userId", data.user.id);

                const userId = data.user.id;
                console.log("User ID do login:", userId);

                window.dispatchEvent(new Event("storage"));

                try {
                    const idiomasRes = await fetch(`http://localhost:5000/usuario/${userId}/idiomas/verificar`);
                    const idiomasData = await idiomasRes.json();

                    if (!idiomasData.selecionouIdiomas) {
                        navigate("/salvarIdiomas");
                    } else {
                        navigate(from, { replace: true });
                    }
                } catch (idiomaErr) {
                    console.error("Erro ao verificar idiomas:", idiomaErr);
                    navigate(from, { replace: true });
                }
            } else {
                setError(data.message || "Erro ao fazer login.");
            }
        } catch (err) {
            setError("Erro ao conectar com o servidor.");
            console.error("Erro na autenticação:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = useCallback(() => {
        setUser(null);
        setCredentials({ email: "", senha: "" });
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        navigate("/login");
    }, [navigate]);

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
                        setUser({ id: data.user.id });
                        sessionStorage.setItem("userId", data.user.id);
                    } else {
                        handleLogout();
                    }
                })
                .catch(() => handleLogout());
        }
    }, [handleLogout]);

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
