import React from 'react';
import usePerfilUsuario from '../../hooks/usePerfilUsuario';

function Perfil() {
    const { perfil, loading, error } = usePerfilUsuario();
    const userIdLogado = 2; //valor deve ser dinamico quando houver verificação de login

    if (loading) return <div>Carregando...</div>
    if (error) return <div>{error}</div>
    if (!perfil) return <div>Perfil não encontrado.</div>
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{perfil.username}</h1>
            <p>{perfil.bio}</p>
            <img src={perfil.foto_perfil} alt={perfil.username} className="w-32 h-32 rounded-full mt-2" />

            {perfil.id === userIdLogado && (
                <button className="mt-4 bg-blue-500 text-white p-2 rounded">Editar Perfil</button>
            )}
        </div>
    )
}

export default Perfil;