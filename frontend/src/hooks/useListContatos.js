import { useEffect, useState } from 'react';
import axios from 'axios';

const useListContatos = () => {
    const [contatos, setContatos] = useState([]);
    const [error, setError] = useState(null);

  
    useEffect(() => {
       

        // Recupera o usuário armazenado no sessionStorage
        const userString = sessionStorage.getItem("user");

        // Verifica se o usuário existe e tem o ID
        if (!userString) {
            setError('Usuário não encontrado.');
            return;
        }

        // Converte o JSON para objeto
        const user = JSON.parse(userString);
        const userIdDaSessao = user?.id;

        if (!userIdDaSessao) {
            setError('ID de usuário não encontrado.');
            console.log("Erro: ID de usuário não encontrado.");
            return;
        }

        // Faz a requisição para buscar os contatos
        const fetchContatos = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/match/contatos/${userIdDaSessao}`);
                setContatos(res.data);
            } catch (err) {
                console.error("Erro ao carregar contatos", err);
                setError('Erro ao carregar contatos.');
            }
        };

        fetchContatos();
    }, []);  // O hook será executado apenas uma vez na montagem, já que userId não precisa ser uma dependência aqui

    if (error) {
        return <div>{error}</div>;
    }

    return { contatos };
};

export default useListContatos;
