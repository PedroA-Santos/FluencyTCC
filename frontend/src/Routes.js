import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Páginas <----------------->
import Home from "./pages/home/Home";
import Idioma from "./pages/idioma/Idioma";

const AppRoutes = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/idiomas" element={<Idioma />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;