usuarioModel = require("../model/usuarioModel");
const { validarCampos } = require("")

exports.listAll = async (req, res) => {
    try {
        const usuarios = await usuarioModel.list();

        if (usuarios.length === 0) {
            return res.status(404).json({ message: "Nenhum usuário encontrado." });
        }
        res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao listar usuarios");
    }
}

exports.listbyId = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const response = await usuarioModel.listFindById(id);

        if (!response || Object.keys(response).length === 0) {
            return res.status(404).json({ message: 'usuario não encontrado' });
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao buscar usuario");
    }
}

exports.postUsuario = async (req, res) => {
    const { username, email, senha, bio, foto_perfil } = req.body;

    const camposValidos = validarCampos({ username, email, senha });

    if (!camposValidos) {
        return res.status(400).json({ message: "Username, email e senhea são obrigatórios." });
    }

    try {
        //não esquecer de criptografar a senha do usuario

        const response = await usuarioModel.post({ username, email, senha, bio, foto_perfil });

        res.status(201).json({ message: "Usuario cadastrado com sucesso", response })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao cadastrar usuario." });
    }
};

exports.putUsuario = async (req, res) => {
    const { id } = req.params;
    const { username, email, senha, bio, foto_perfil } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID invalido ou ausente" });
    }

    const camposValidos = validarCampos({ username, email, senha });

    if (!camposValidos) {
        return res.status(400).json({ message: "Username, email e senhea são obrigatórios." });
    }
    try {
        const response = await usuarioModel.put({ username, email, senha, bio, foto_perfil, id });

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(201).json({ message: "Usuario atualizado com sucesso!", response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar usuario" });
    }
};

exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID invalido ou ausente" });
    }

    try {
        const response = await usuarioModel.delete(id);

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "Usuario não encontrado" })
        }

        res.status(200).json({ message: "Usuario excluido com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao excluir usuario" })
    }
}