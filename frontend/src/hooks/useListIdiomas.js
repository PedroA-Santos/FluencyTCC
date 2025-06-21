import { useState, useEffect } from "react";
import axios from "axios";

function useListIdiomas() {
    const [idiomas, setIdiomas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchIdiomas = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:5000/idioma');
                setIdiomas(response.data);
                setSuccess("Idiomas carregados com sucesso");
                console.log("🔹 Idiomas carregados com sucesso", response.data);
            } catch (err) {
                setError(err.message);
                console.log("🔹 Erro ao carregar idiomas", err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchIdiomas();
    }, []);

    return { idiomas, loading, error, success };
}

export default useListIdiomas;
