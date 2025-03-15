import { Link } from "react-router-dom";

const Navbar = () => {
    const userIdLogado = 2 //id provisório e deve ser dinamico

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/idioma">Idiomas</Link></li>
                <li><Link to="/chat">chat</Link></li>
                <li><Link to="/interesse">interesse</Link></li>
                <li><Link to="/login">login</Link></li>
                <li><Link to={`/perfil/${userIdLogado}`}>perfil</Link></li>
                <li><Link to="/usuarioCadastro">Cadastro usuario Parte 1</Link></li>
                <li><Link to="/usuarioCadastro2">Cadastro usuario Parte 2</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;