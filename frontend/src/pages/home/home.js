import React from 'react'
import useListContatos from '../../hooks/useListContatos';

function Home() {
    const contatos = useListContatos();

    return (
        <div className='w-1/4 h-screen bg-gray-100 p-4 overflow-y-auto border-r'>
            <h2 className='text-xl font-bold mb-4'>Contatos </h2>
            <ul>
                {contatos.map(match =>(
                    <li key={match.id} className='flex items-center gap-3 p-2 hover:bg-gray-200 cursor-pointer rounded-lg'>
                        <img src={match.foto_perfil} alt={match.username} className="w-10 h-10 rounded-full" />
                        <p className='text-lg'>{match.username}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;
