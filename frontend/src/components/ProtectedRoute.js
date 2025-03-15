import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />; // Redireciona para login se não houver token
    }

    return <Outlet />; // Permite acessar a página protegida
};

export default ProtectedRoute;
