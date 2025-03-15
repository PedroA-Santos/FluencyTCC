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
                console.log('====================================');
                console.log(res.data, "retorno do user");
                console.log('====================================');

                setPerfil(res.data);
            } catch (error) {
                setError("Erro ao carregar perfil.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [id]);

    return { perfil, loading, error };

};

export default usePerfilUsuario;