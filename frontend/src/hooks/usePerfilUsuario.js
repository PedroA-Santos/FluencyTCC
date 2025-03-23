import { useState, useEffect } from "react";
import axios from "axios";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

const usePerfilUsuario = () => {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userIdDaSessao = verificarSessaoUsuario();

    console.log("No hook de perfil", userIdDaSessao);



    useEffect(() => {
        if (!userIdDaSessao) return;

        const fetchPerfil = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/usuario/${userIdDaSessao}`);
                setPerfil(res.data);
            } catch (err) {
                setError("Erro ao carregar perfil.");
                console.error("Erro ao carregar perfil do usuário", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [userIdDaSessao]);


    return { perfil, loading, error };

};

export default usePerfilUsuario;