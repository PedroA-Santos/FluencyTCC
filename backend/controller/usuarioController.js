const usuarioModel = require("../model/usuarioModel");
const usuarioInteresseModel = require("../model/usuarioInteressesModel");
const { validarCampos } = require("../utils/validarCampos");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const path = require('path');


const secretKey = process.env.SECRET_KEY;

exports.listAll = async (req, res) => {
    try {
        const usuarios = await usuarioModel.list();

        if (!usuarios.length) {
            return res.status(404).json({ message: "Nenhum usuário encontrado." });
        }

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Erro ao listar usuários:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};

exports.listById = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const usuario = await usuarioModel.listFindById(id);

        if (!usuario) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json(usuario);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};


// esse post é só pra usar no postman
exports.postUsuario = async (req, res) => {
    const { username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id } = req.body;

    if (!validarCampos({ username, email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id })) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios corretamente." });
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido." });
    }

    try {
        const usuarioExistente = await usuarioModel.listByEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ message: "Este email já está cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        const novoUsuario = await usuarioModel.post({
            username,
            email,
            senha: hashedPassword,
            idioma_nativo_id,
            genero_id,
            bio,
            foto_perfil,
            data_nascimento,
            pais_origem_id
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
    const { username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    if (!validarCampos({ username, email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id })) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
        const usuarioAtualizado = await usuarioModel.put({
            id, username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil, data_nascimento, pais_origem_id
        });

        if (usuarioAtualizado.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({ message: "Usuário atualizado com sucesso!" });
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
};

exports.deleteUsuario = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const resultado = await usuarioModel.delete(id);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        res.status(200).json({ message: "Usuário excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        res.status(500).json({ message: "Erro ao excluir usuário." });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: "Os campos email e senha são obrigatórios." });
    }

    try {
        const user = await usuarioModel.listByEmail(email);

        if (!user || !(await bcrypt.compare(senha, user.senha))) {
            return res.status(401).json({ message: "Email ou senha incorretos." });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });

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




// ESSAS DUAS FUNÇÕES ABAIXO SÃO PARA O CADASTRO DO USUARIO EM DUAS ETAPAS


// ESSA FUNÇÃO REGISTRA O USUÁRIO NA PRIMEIRA ETAPA APENAS (EMAIL,SENHA ,IDIOMA NATIVO E GENERO)
exports.postUsuarioStep1 = async (req, res) => {
    const { email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id } = req.body;

    if (!validarCampos({ email, senha, idioma_nativo_id, genero_id, data_nascimento, pais_origem_id })) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios corretamente." });
    }

    // Validação do formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido." });
    }

    //  Verifica se o email já está cadastrado
    try {
        const usuarioExistente = await usuarioModel.listByEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ message: "Este email já está cadastrado." });
        }
    } catch (error) {
        console.error("Erro ao verificar email:", error);
        return res.status(500).json({ message: "Erro ao validar email." });
    }

    // Validação da senha (mínimo 8 caracteres, 1 letra maiúscula, 1 número)
    const senhaRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!senhaRegex.test(senha)) {
        return res.status(400).json({ message: "A senha deve ter no mínimo 8 caracteres, incluindo 1 letra maiúscula e 1 número." });
    }

    //  Validação da data de nascimento
    const hoje = new Date();
    const idadeMinima = 14;
    const idadeMaxima = 120;
    const dataMinima = new Date(hoje.getFullYear() - idadeMinima, hoje.getMonth(), hoje.getDate());
    const dataMaxima = new Date(hoje.getFullYear() - idadeMaxima, hoje.getMonth(), hoje.getDate());

    const dataNascimentoObj = new Date(data_nascimento);

    if (isNaN(dataNascimentoObj.getTime())) {
        return res.status(400).json({ message: "Data de nascimento inválida." });
    }

    if (dataNascimentoObj > hoje) {
        return res.status(400).json({ message: "Data de nascimento não pode estar no futuro." });
    }

    if (dataNascimentoObj > dataMinima) {
        return res.status(400).json({ message: "Você deve ter pelo menos 18 anos." });
    }

    if (dataNascimentoObj < dataMaxima) {
        return res.status(400).json({ message: "Data de nascimento muito antiga." });
    }


    // Criar usuário com senha criptografada
    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const novoUsuario = await usuarioModel.postStep1({
            email,
            senha: hashedPassword,
            idioma_nativo_id,
            genero_id,
            data_nascimento,
            pais_origem_id
        });

        return res.status(201).json({
            id: novoUsuario.id,
            email,
            idioma_nativo_id,
            genero_id,
            data_nascimento,
            pais_origem_id
        });

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
};

exports.updateUsuarioStep2 = async (req, res) => {
    const { id } = req.params;
    const { username, bio, interesses } = req.body;

    console.log("Executando updateUsuarioStep2 para ID:", id);

    if (!id) {
        return res.status(400).json({ message: "ID do usuário é obrigatório." });
    }

    const foto_perfil = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const usuarioExistente = await usuarioModel.listFindById(id);
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        const userNameExistente = await usuarioModel.listByUsername(username);

        if (userNameExistente) {
            return res.status(409).json({ message: "Este nome de usuário já está em uso." });
        }

        // Atualiza as informações do perfil
        await usuarioModel.updateStep2({ id, username, bio, foto_perfil });

        // Se houver interesses, atualiza a tabela usuario_interesses
        if (interesses && Array.isArray(interesses) && interesses.length > 0) {
            console.log("Interesses são um array! Atualizando...");

            // Remove interesses antigos antes de inserir os novos
            await usuarioInteresseModel.delete({ usuario_id: id });
            console.log("Interesses antigos removidos.");

            // Insere os novos interesses em lote
            await usuarioInteresseModel.postMultiple({ usuario_id: id, interesses });

            console.log("Interesses inseridos com sucesso:", interesses);
        } else {
            console.log("Nenhum interesse válido foi enviado.");
        }

        return res.status(200).json({ message: "Perfil atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return res.status(500).json({ message: "Erro ao atualizar perfil." });
    }
};
