import { useEffect, useState } from 'react';
import axios from 'axios';

const useListIdiomas = () => {
    const [idiomas, setIdiomas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIdiomas = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/idioma');
                if (response.data && Array.isArray(response.data)) {
                    setIdiomas(response.data);
                } else {
                    setError("Resposta inválida da API");
                }
            } catch (error) {
                console.error("Erro ao buscar idiomas:", error);
                setError(error.message || "Erro desconhecido");
            } finally {
                setLoading(false);
            }
        };

        fetchIdiomas();
    }, []);

    return { idiomas, loading, error };
};

export default useListIdiomas;
