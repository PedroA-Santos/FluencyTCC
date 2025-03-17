import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

const usePerfilUsuario = () => {
    const { id } = useParams();
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPerfil = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/usuario/${id}`);

                setPerfil(res.data);
            } catch (err) {
                setError("Erro ao carregar perfil.");
                console.error("Erro ao carregar perfil do usuario", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [id]);

    return { perfil, loading, error };

};

export default usePerfilUsuario;