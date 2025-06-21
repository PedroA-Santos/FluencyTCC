import { useState, useEffect } from "react";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";
import axios from "axios";

function useListIdiomasUsuario() {
  const [idiomas, setIdiomas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdDaSessao = verificarSessaoUsuario();

    if (!userIdDaSessao) {
      setError("Usuário não está logado ou sessão inválida.");
      setLoading(false);
      return;
    }

    const fetchIdiomasUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/usuarioIdiomas/${userIdDaSessao}`);
        setIdiomas(res.data);

        if (res.data.length === 0) {
          setError("Nenhum idioma encontrado para este usuário.");
        }
      } catch (err) {
        setError("Erro ao carregar idiomas do usuário.");
        console.error("Erro ao carregar idiomas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIdiomasUser();
  }, []);

  return { idiomas, error, loading };
}

export default useListIdiomasUsuario;
