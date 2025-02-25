import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Páginas <----------------->
import Home from "./pages/home/home";
import Idioma from "./pages/idioma/idioma";
import Chat from "./pages/chat/chat";
import Interesse from "./pages/interesse/interesse";
import Login from "./pages/login/login";
import Perfil from "./pages/perfil/perfil";
import Usuario from "./pages/usuario/usuario";

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/idioma" element={<Idioma />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/interesse" element={<Interesse />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/usuario" element={<Usuario />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;