import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import verificarSessaoUsuario from '../utils/verificarSessaoUsuario';
import { useMatch } from '../context/matchContext';

const useListContatos = () => {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { matchAtualizado } = useMatch();

  const userIdDaSessao = verificarSessaoUsuario(setError);

  const fetchContatos = useCallback(async () => {
    if (!userIdDaSessao) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/match/contatos/${userIdDaSessao}`);
      setContatos(res.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar contatos', err);
      setError('Erro ao carregar contatos.');
    } finally {
      setLoading(false);
    }
    console.log("chamou o hook contatos");
  }, [userIdDaSessao]);

  useEffect(() => {
    fetchContatos();

    const intervalId = setInterval(() => {
      fetchContatos();
    }, 60000); // a cada 60 segundos

    return () => clearInterval(intervalId);
  }, [fetchContatos, matchAtualizado]);

  return { contatos, error, loading };
};

export default useListContatos;
