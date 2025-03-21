import { useEffect, useState } from 'react';
import axios from 'axios';
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

const useBuscarMatches = () => {
    const [sugeridos, setSugeridos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const userIdDaSessao = verificarSessaoUsuario(setError);

    useEffect(() => {
        const fetchSugestoes = async () => {
            if (!userIdDaSessao) {
                return;
            }

            try {
                const res = await axios.get(`http://localhost:5000/match/sugeridos/${userIdDaSessao}`);

                setSugeridos(res.data);
            } catch (error) {
                setError("Erro ao procurar usuarios.");
                console.error("Erro ao buscar usuarios.", error);
            } finally {
                setLoading(false); 
            }
        };

        fetchSugestoes();
    }, [userIdDaSessao]);

    return { sugeridos, loading, error };

};

export default useBuscarMatches;