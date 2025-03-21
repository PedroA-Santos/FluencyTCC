import { useState, useEffect } from "react";
import axios from "axios";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

const usePerfilUsuario = () => {
    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userIdDaSessao = verificarSessaoUsuario(setError);



    useEffect(() => {
        const fetchPerfil = async () => {

            if (!userIdDaSessao) {
                return;
            }
            try {
                const res = await axios.get(`http://localhost:5000/usuario/${userIdDaSessao}`);

                setPerfil(res.data);
            } catch (err) {
                setError("Erro ao carregar perfil.");
                console.error("Erro ao carregar perfil do usuario", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPerfil();
    }, [userIdDaSessao]);

    return { perfil, loading, error };

};

export default usePerfilUsuario;