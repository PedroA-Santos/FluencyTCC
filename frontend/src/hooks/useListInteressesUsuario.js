import { useState, useEffect } from "react";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";
import axios from "axios";

function useListInteressesUsuario() {
  const [interesses, setInteresses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdDaSessao = verificarSessaoUsuario();

    if (!userIdDaSessao) {
      setError("Usuário não está logado ou sessão inválida.");
      setLoading(false);
      return;
    }

    const fetchInteressesUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/usuarioInteresses/${userIdDaSessao}`);
        setInteresses(res.data);

        if (res.data.length === 0) {
          setError("Nenhum interesse encontrado para este usuário.");
        }
      } catch (err) {
        setError("Erro ao carregar interesses do usuário.");
        console.error("Erro ao carregar interesses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInteressesUser();
  }, []);

  return { interesses, error, loading };
}

export default useListInteressesUsuario;
