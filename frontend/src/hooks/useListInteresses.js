import axios from "axios"
import { useEffect, useState } from "react"


function useListInteresses() {

    const [interesses, setInteresses] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    useEffect(() => {

        const fetchInteresses = async () => {
            setLoading(true)
            try {
                const response = await axios.get('http://localhost:5000/interesse')
                setInteresses(response.data)
                setSuccess("Interesses carregados com sucesso")
                console.log("🔹 Interesses carregados com sucesso", response.data)
            } catch (err) {
                setError(err.message)
                console.log("🔹 Erro ao carregar interesses", err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchInteresses()

    }, [])

    return { interesses, loading, error, success }
}

export default useListInteresses
