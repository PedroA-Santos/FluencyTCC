import React, { useEffect, useState } from 'react';
import axios from 'axios';

const useListContatos = () => {
    const [contatos, setContatos] = useState([]);
    const [error, setError] = useState(null);

    const userId = 2; // ID provisório, deve ser substituído por autenticação

    useEffect(() => {
        const fetchContatos = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/match/contatos/${userId}`);

                console.log("retorno do hook", res.data);

                setContatos(res.data);
            } catch (error) {
                setError('Erro ao carregar contatos.');
                console.error(error);
            }
        };

        fetchContatos();
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return contatos;
};


export default useListContatos;