const verificarSessaoUsuario = () => {
    const userId = sessionStorage.getItem("userId");

    if (!userId) {
        console.error('Usuário não encontrado.');
        return null;
    }

    return userId;
}

export default verificarSessaoUsuario;
