import React from "react";
import Contatos from "../../components/Contatos"; // Importa o componente Contatos

function Home() {
    return (
        <div className="flex">
            {/* Contatos */}
            <Contatos /> {/* Renderiza os contatos */}

            {/* Main Content */}
            <div className="flex-grow p-4">
                <h1 className="text-2xl font-bold mb-4">Bem-vindo à Página Inicial</h1>
                <p>
                    Aqui é o espaço principal da sua Home. Você pode adicionar outros componentes
                    ou conteúdo principal aqui, como um feed, cards, ou o que for necessário.
                </p>
            </div>
        </div>
    );
}

export default Home;
