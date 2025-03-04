const usuarioModel = require("../model/usuarioModel");
const { validarCampos } = require("../utils/validarCampos");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

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

        res.status(200).json(usuario[0]);
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor." });
    }
};


// esse post é só pra usar no postman
exports.postUsuario = async (req, res) => {
    const { username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil } = req.body;

    if (!validarCampos({ username, email, senha, idioma_nativo_id, genero_id })) {
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
    const { username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    if (!validarCampos({ username, email, senha, idioma_nativo_id, genero_id })) {
        return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    try {
        const usuarioAtualizado = await usuarioModel.put({
            id, username, email, senha, idioma_nativo_id, genero_id, bio, foto_perfil
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
    const { email, senha, idioma_nativo_id, genero_id, } = req.body;

    // Verificar se email, senha e idioma_nativo_id foram fornecidos
    if (!email || !senha || !idioma_nativo_id || !genero_id) {
        return res.status(400).json({ message: "Email, senha , idioma nativo e genero são obrigatórios." });
    }

    // Validar o formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Formato de email inválido." });
    }

    try {
        // Verificar se o idioma_nativo_id é válido (existe na tabela 'idiomas')
        const idiomaExistente = await usuarioModel.listByIdIdioma(idioma_nativo_id);
        if (!idiomaExistente) {
            return res.status(400).json({ message: "Idioma nativo inválido." });
        }

        // Verificar se o email já está cadastrado
        const usuarioExistente = await usuarioModel.listByEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ message: "Este email já está cadastrado." });
        }

        // Criptografar a senha antes de armazenar
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar usuário com email, senha e idioma_nativo_id
        const novoUsuario = await usuarioModel.postStep1({
            email,
            senha: hashedPassword,
            idioma_nativo_id,
            genero_id // Adicionando o idioma nativo na primeira etapa
        });

        return res.status(201).json({
            message: "Primeira etapa concluída. Complete seu perfil.",
            usuario: { id: novoUsuario.id, email }
        });

    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        return res.status(500).json({ message: "Erro ao cadastrar usuário." });
    }
};



// ESSA FUNÇÃO ATUALIZA O USUÁRIO CADASTRADO NA PRIMEIRA ETAPA(INFORMAÇÕES COMPLEMENTARES)

exports.updateUsuarioStep2 = async (req, res) => {
    const { id } = req.params;  // Acessando o id da URL
    const { username, bio, foto_perfil } = req.body;

    console.log('ID recebido para atualização:', id);  // Verificando se o id está correto

    if (!username || !bio || !foto_perfil) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios corretamente." });
    }

    try {
        // Verificar se o usuário existe
        const usuarioExistente = await usuarioModel.listFindById(id);  // Passando o id para a busca no banco
        if (!usuarioExistente) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        // Passar o id e os dados de atualização para a função updateStep2
        await usuarioModel.updateStep2({
            id,
            username,
            bio,
            foto_perfil
        });

        return res.status(200).json({
            message: "Perfil atualizado com sucesso!",
            usuario: {
                id,
                username,
                bio,
                foto_perfil
            }
        });

    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({ message: "Erro ao atualizar usuário." });
    }
};

