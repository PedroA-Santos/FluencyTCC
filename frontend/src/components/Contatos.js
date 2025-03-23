import React from "react";
import styles from "./Contatos.module.css";
import useListContatos from "../hooks/useListContatos";

function Contatos() {

    const { contatos, error, loading } = useListContatos();

    if (loading) {
        return <div>Carregando contatos...</div>
    }

    // Verifica se há erro na requisição
    if (error) {
        return <div className="text-red-500">Erro: {error}</div>;
    }

    return (
        <div className='w-1/4 h-screen bg-gray-100 p-4 overflow-y-auto border-r'>
            <h2 className='text-xl font-bold mb-4'>Contatos</h2>
            <ul>
                {contatos.map(match => (
                    <li key={match.id} className='flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer rounded-lg'>
                        <img src={match.foto_perfil || "/images/default-image.jpg"} alt={match.username} className={styles.profileImage} />
                        <p className='text-lg'>{match.username}</p>
                    </li>
                ))}
            </ul>       
        </div>
    );
};

export default Contatos;