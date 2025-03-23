import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import verificarSessaoUsuario from "../utils/verificarSessaoUsuario";

const Navbar = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const atualizarIdUsuario = () => {
            setUserId(verificarSessaoUsuario());
        };

        atualizarIdUsuario(); // Atualiza o ID ao carregar a Navbar

        // Adiciona um "ouvinte" para detectar mudanças no sessionStorage
        window.addEventListener("storage", atualizarIdUsuario);

        return () => {
            window.removeEventListener("storage", atualizarIdUsuario);
        };
    }, []);

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/chat">Chat</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to={userId ? `/perfil/${userId}` : "/login"}>Perfil</Link></li>
                <li><Link to="/usuarioCadastro">Cadastro Parte 1</Link></li>
                <li><Link to="/usuarioCadastro2">Cadastro Parte 2</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
