import axios from 'axios';
import { useEffect, useState } from 'react'

function useListPaises() {

    const [paises, setPaises] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)


    useEffect(() => {

        const fetchPaises = async () => {
            setLoading(true);
            setError(null)
            setSuccess(null)


            try {
                const res = await axios.get('http://localhost:5000/pais');

                if (res.data || Array.isArray(res.data)) {
                    setPaises(res.data)
                } else {
                    setError("Resposta inválida da API")
                }
                setLoading(false)
                setSuccess("Paises carregados com sucesso")
            } catch (err) {

                console.log("Erro no hook de listar paises", err);
                setError(err.message || "Erro ao listar paises")
            } finally {
                setLoading(false)
            }
        }

        fetchPaises();

    }, [])

    return { paises, loading, error, success };


}

export default useListPaises
