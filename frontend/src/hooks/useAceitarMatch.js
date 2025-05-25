// hooks/useAceitarMatch.js
import { useState } from "react";
import axios from "axios";

const useAceitarMatch = () => {
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    const aceitarMatch = async (suggestedUserId, userId, idiomaComum, callback) => {
        console.log("[useAceitarMatch] Iniciando:", { suggestedUserId, userId, idiomaComum });
        setLoading(true);
        setErro(null);
        setSucesso(false);

        try {
            const response = await axios.post("http://localhost:5000/match/aceitar-ou-criar", {
                usuario1_id: userId,
                usuario2_id: suggestedUserId,
            });
            console.log("[useAceitarMatch] Resposta recebida:", response.data);
            setSucesso(true);
            if (callback) {
                console.log("[useAceitarMatch] Chamando callback");
                callback();
            }
            return response.data;
        } catch (err) {
            console.error("[useAceitarMatch] Erro:", err);
            setErro(err.response?.data?.message || "Erro ao aceitar match");
            throw err;
        } finally {
            console.log("[useAceitarMatch] Finalizando, setLoading(false)");
            setLoading(false);
        }
    };

    return { aceitarMatch, loading, erro, sucesso };
};

export default useAceitarMatch;