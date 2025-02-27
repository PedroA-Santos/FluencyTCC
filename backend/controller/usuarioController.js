const usuarioModel = require("../model/usuarioModel");
const { validarCampos } = require("../utils/validarCampos")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

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

exports.listById = async (req, res) => {
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

    if (!validarCampos({ username, email, senha })) {
        return res.status(400).json({ message: "Username, email e senha são obrigatórios." });
    }

    // Validação básica de email para não ter email incorreto 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido." });
    }

    try {
        // Verificar se o email já está cadastrado
        const usuarioExistente = await usuarioModel.listByEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ message: "Este email já está cadastrado." });
        }

        // Criptografar a senha
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Criar o usuário
        const novoUsuario = await usuarioModel.post({
            username,
            email,
            senha: hashedPassword,
            bio,
            foto_perfil
        });

        return res.status(201).json({
            message: "Usuário cadastrado com sucesso",
            usuario: { id: novoUsuario.id, username, email, bio, foto_perfil }
        });

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
};

exports.putUsuario = async (req, res) => {
    const { id } = req.params;
    const { username, email, senha, bio, foto_perfil } = req.body;
    console.log(id, username, email, senha, bio, foto_perfil);


    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID invalido ou ausente" });
    }

    const camposValidos = validarCampos({ username, email, senha });

    if (!camposValidos) {
        return res.status(400).json({ message: "Username, email e senhea são obrigatórios." });
    }
    try {
        const response = await usuarioModel.put({ username, email, senha, bio, foto_perfil, id });

        if (response.affectedRows === 0) {
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



exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Os campos email e senha são obrigatórios." });
    }

    try {
        const user = await usuarioModel.listByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        const senhaValida = await bcrypt.compare(password, user.senha);

        if (!senhaValida) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secretKey,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login bem-sucedido",
            user: { id: user.id, email: user.email, username: user.username },
            token
        });

    } catch (error) {
        console.error("Erro ao realizar login:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};