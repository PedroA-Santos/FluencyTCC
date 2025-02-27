import React from "react";
import { Link } from "react-router-dom";

//HOOK DO LOGIN 
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const {
        credentials,
        loading,
        error,
        handleChange,
        handleLogin,
    } = useLogin();

    return (
        <div >
            <h1>Login</h1>

            {/* Exibe mensagem de erro, se houver */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Formulário de login */}
            <form onSubmit={handleLogin}> {/* aq ele chama a função que faz a requisição pro back na hora de enviar o form */}
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email} /*aq ele liga o valor do campo ao estado credentials passando o email no hook useLogin */
                        onChange={handleChange} /* chamado sempre que o usuário digita atualizando o estado do credentials.email */
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? "Carregando..." : "Login"}
                </button>
            </form>

            {/* Link para página de cadastro */}
            <Link to="/registerUser">Não possui cadastro? Cadastrar</Link>
        </div>
    );
};

export default Login;
