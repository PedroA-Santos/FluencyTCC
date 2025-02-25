import { Link } from "react-router-dom";

const Navbar = () => {
    
    
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/idioma">Idiomas</Link></li>
                <li><Link to="/chat">chat</Link></li>
                <li><Link to="/interesse">interesse</Link></li>
                <li><Link to="/login">login</Link></li>
                <li><Link to="/perfil">perfil</Link></li>
                <li><Link to="/usuario">usuario</Link></li>
            </ul>
        </nav>
    ) 
}

export default Navbar;