import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from '../src/components/Navbar';
import Home from "./pages/home/home";
import Idioma from "./pages/idioma/idioma";
import Login from "./pages//login/login";
import Perfil from "./pages/perfil/perfil";
import Chat from "./pages/chat/chat";
import Interesse from "./pages/interesse/interesse";
import CadastroUsuario from "./pages/usuario/usuarioCadastro1";
import CadastroUsuario2 from "./pages/usuario/usuarioCadastro2";
import SalvarIdiomas from './pages/IdiomasAprender/idiomasAprender';

const AppRoutes = () => {
    return (
        <Router> {/* Envolva suas rotas com Router */}
            <Routes>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/idioma" element={<Idioma />} />
                    <Route path="/chat/:matchId" element={<Chat />} />
                    <Route path="/interesse" element={<Interesse />} />
                    <Route path="/perfil/:id" element={<Perfil />} />
                    <Route path="/salvarIdiomas" element={<SalvarIdiomas />} />
                </Route>


                <Route path="/login" element={<Login />} />
                <Route path="/usuarioCadastro" element={<CadastroUsuario />} />
                <Route path="/usuarioCadastro2/:id" element={<CadastroUsuario2 />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
