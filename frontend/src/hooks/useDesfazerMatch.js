import { useState } from "react";
import axios from "axios";

const useDesfazerMatch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const desfazerMatch = async (matchId, usuarioId) => {
        console.log(`[useDesfazerMatch] Iniciando desfazerMatch: matchId=${matchId}, usuarioId=${usuarioId}`);
        if (loading) {
            console.warn("[useDesfazerMatch] Requisição já em andamento, ignorando...");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            console.log("[useDesfazerMatch] Enviando requisição PUT para /matches/:matchId/reject");
            const response = await axios.put(`http://localhost:5000/match/${matchId}/reject`, {
                usuarioId,
            });
            console.log("[useDesfazerMatch] Resposta recebida:", response.data);
            setSuccess(true);
            return response.data;
        } catch (err) {
            console.error("[useDesfazerMatch] Erro na requisição:", err);
            setError(err.response?.data?.message || "Erro ao desfazer match");
            throw err;
        } finally {
            console.log("[useDesfazerMatch] Finalizando requisição, setLoading(false)");
            setLoading(false);
        }
    };

    console.log("[useDesfazerMatch] Estado atual:", { loading, error, success });

    return { desfazerMatch, loading, error, success };
};

export default useDesfazerMatch;