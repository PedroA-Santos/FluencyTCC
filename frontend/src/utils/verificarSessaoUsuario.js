const verificarSessaoUsuario = (setError) => {
    // Recupera o usuário armazenado no sessionStorage
    const userString = sessionStorage.getItem("user");

    // Verifica se o usuário existe e tem o ID
    if (!userString) {
        setError('Usuário não encontrado.');
        return null;
    }

    // Converte o JSON para objeto
    const user = JSON.parse(userString);
    const userIdDaSessao = user?.id;

    if (!userIdDaSessao) {
        setError('ID de usuário não encontrado.');
        console.log("Erro: ID de usuário não encontrado.");
        return null;
    }

    return userIdDaSessao;
}

export default verificarSessaoUsuario;