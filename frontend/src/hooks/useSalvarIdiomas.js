import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useSalvarIdiomas = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const salvarIdiomas = async (userId, idiomasSelecionados) => {
        setLoading(true);
        setError(null);
        setSuccessMessage("");

        try {
            // Enviando os idiomas com o nível para o backend
            const response = await axios.post(`http://localhost:5000/usuarioIdiomas/${userId}/idiomas`, {
                idiomas: idiomasSelecionados,  // Cada item precisa ter idiomaId e nivel
            });

            if (response.status === 200) {
                setSuccessMessage("Idiomas salvos com sucesso!");
                navigate("/"); // Redirecionar para a página inicial após salvar

            }
        } catch (err) {
            console.error("Erro ao salvar idiomas:", err);
            setError("Erro ao salvar idiomas.");
        } finally {
            setLoading(false);
        }
    };

    return {
        salvarIdiomas,
        loading,
        error,
        successMessage,
    };
};

export default useSalvarIdiomas;
