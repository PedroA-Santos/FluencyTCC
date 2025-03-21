import { useEffect, useState } from 'react';
import axios from 'axios';
import verificarSessaoUsuario from '../utils/verificarSessaoUsuario'; //função que retorna id do usuario logado

const useListContatos = () => {
    const [contatos, setContatos] = useState([]);
    const [error, setError] = useState(null);

  
    useEffect(() => {
       
        const userIdDaSessao = verificarSessaoUsuario(setError);

        if (!userIdDaSessao) {
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
