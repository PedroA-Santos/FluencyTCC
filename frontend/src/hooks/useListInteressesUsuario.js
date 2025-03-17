import { useState, useEffect } from "react";
import axios from "axios";


function useListInteressesUsuario() {

    const [interesses, setInteresses] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const userString = sessionStorage.getItem("user");

        // Verifica se o usuário existe e tem o ID
        if (!userString) {
            setError('Usuário não encontrado.');
            console.log("Erro: Usuário não encontrado.");
            return;
        }

        // Converte o JSON para objeto
        const user = JSON.parse(userString);
        const userIdDaSessao = user?.id;
        console.log("ID do usuário da sessão:", userIdDaSessao);

        if (!userIdDaSessao) {
            setError('ID de usuário não encontrado.');
            console.log("Erro: ID de usuário não encontrado.");
            return;
        }

        
        const fetchInteressesUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`http://localhost:5000/usuarioInteresses/${userIdDaSessao}`);
                setInteresses(res.data);
                
            } catch (err) {
                setError("Erro ao carregar perfil.");
                console.error("Erro ao Carregar Interesses", err);
            } finally {
                setLoading(false);
            }
        };

        fetchInteressesUser();
    }, []);


    return { interesses, error, loading };

}

export default useListInteressesUsuario
