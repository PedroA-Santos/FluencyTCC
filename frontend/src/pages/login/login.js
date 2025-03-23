import React from "react";
import { Link } from "react-router-dom";
import styles from "./login.module.css";

//HOOK DO LOGIN 
import useLogin from "../../hooks/useLogin";
import FluencyTitle from "../../components/FluencyTitle";

const Login = () => {
    const {
        credentials,
        loading,
        error,
        handleChange,
        handleLogin,
    } = useLogin();

    return (
        <div className={styles.container} >
            <FluencyTitle />
            <h1 className={styles.h1Login}>Faça seu Login</h1>

            {/* Exibe mensagem de erro, se houver */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Formulário de login */}
            <form onSubmit={handleLogin} className={styles.form} > {/* aq ele chama a função que faz a requisição pro back na hora de enviar o form */}
                <div>
                    <label htmlFor="email">E-mail:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Insira seu e-mail"
                        value={credentials.email} /*aq ele liga o valor do campo ao estado credentials passando o email no hook useLogin */
                        onChange={handleChange} /* chamado sempre que o usuário digita atualizando o estado do credentials.email */
                        required
                    />
                </div>
                <div>
                    <label htmlFor="senha">Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        placeholder="Insira sua senha"
                        value={credentials.senha}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className={styles.loginButton}type="submit" disabled={loading}>
                    {loading ? "Carregando..." : "Login"}
                </button>
            </form>

            {/* Link para página de cadastro */}
            <Link className={styles.linkRegister} to="/usuarioCadastro">Não possui cadastro? Cadastrar</Link>
        </div>
    );
};

export default Login;
