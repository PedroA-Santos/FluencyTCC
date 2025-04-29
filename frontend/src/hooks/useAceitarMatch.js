import { useState } from 'react';
import axios from 'axios';
import { useMatch } from '../context/matchContext'; // ajuste o caminho correto para o seu projeto

function useAceitarMatch() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sucesso, setSucesso] = useState(false);

    const { notificarMatch } = useMatch(); // <- PEGANDO do contexto!

    const aceitarMatch = async (matchId, usuario1_id, usuario2_id, idioma_comum, onSuccessCallback) => {
        setLoading(true);
        setError(null);
        setSucesso(false);

        try {
            await axios.post("http://localhost:5000/match/aceitar-ou-criar", {
                usuario1_id,
                usuario2_id,
                idioma_comum,
                status: "aceito",
            });

            setSucesso(true);
            if (onSuccessCallback) {
                onSuccessCallback(); // <- avança o card depois que o match é aceito
            }
            notificarMatch(); // <- NOTIFICANDO que teve um novo match
        } catch (err) {
            console.error("Erro ao aceitar match:", err);
            setError("Erro ao aceitar match");
        } finally {
            setLoading(false);
        }
    };

    return { aceitarMatch, loading, error, sucesso };
}

export default useAceitarMatch;
