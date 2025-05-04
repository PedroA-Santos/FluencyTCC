import { useState, useEffect } from "react";
import axios from "axios";

function usePerfilUsuario(userId) {
    const [perfil, setPerfil] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setError("ID do usuário não fornecido.");
            setLoading(false);
            return;
        }

        const fetchPerfil = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/usuario/${userId}`);
                setPerfil(res.data);
            } catch (err) {
                setError("Erro ao carregar perfil do usuário");
                console.error("Erro ao carregar perfil do usuário", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [userId]);

    return { perfil, error, loading };
}

export default usePerfilUsuario;
