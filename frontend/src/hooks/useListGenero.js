import { useState, useEffect } from 'react';
import axios from 'axios';

function useListGenero() {
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGeneros = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/genero');
                console.log("Resposta da API:", response.data);

                if (response.data && Array.isArray(response.data)) {

                    setGeneros(response.data);
                } else {
                    setError("Resposta inválida da API");
                }
            } catch (error) {
                console.error("Erro ao buscar gêneros:", error);
                setError(error.message || "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchGeneros();
    }, []);

    return { generos, loading, error };
}

export default useListGenero;
