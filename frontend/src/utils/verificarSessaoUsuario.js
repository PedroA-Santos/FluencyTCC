const verificarSessaoUsuario = () => {
    // Recupera o usuário armazenado no sessionStorage
    const userString = sessionStorage.getItem("user");

    // Verifica se o usuário existe e tem o ID
    if (!userString) {
        console.error('Usuário não encontrado.');
        return;
    }

    // Converte o JSON para objeto
    const user = JSON.parse(userString);
    const userIdDaSessao = user?.id;

    if (!userIdDaSessao) {
        console.error('Erro: ID de usuário não encontrado.');
        return;
    }

    return userIdDaSessao;
}

export default verificarSessaoUsuario;