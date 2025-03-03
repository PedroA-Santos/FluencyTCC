const matchModel = require('../model/matchModel');
const matchService = require("../services/matchServices"); ///importa o serviço de sugestão de usuarios - ainda deve ser melhorado

const { validarCampos } = require('../utils/validarCampos');


exports.listAll = async (req, res) => {
    try {
        const matches = await matchModel.list();

        if (matches.length === 0) {
            return res.status(404).json({ message: "Nenhum match encontrado" });
        }

        return res.status(200).json(matches);
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro ao listar matches');
    }
}


exports.listById = async (req, res) => {
    const { id } = req.params;


    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const response = await matchModel.listById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Match não encontrada" })

        }

        res.status(200).json({ message: "Match encontrado", response });
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro ao listar Match');
    }
}


exports.postMatch = async (req, res) => {
    const { usuario1_id, usuario2_id, idioma_comum, status } = req.body;

    const camposValidados = validarCampos({ usuario1_id, usuario2_id, idioma_comum, status });


    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }


    try {
        const response = await matchModel.post({ usuario1_id, usuario2_id, idioma_comum, status });
        res.status(201).json({ message: "Match criado com sucesso", response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao cadastrar match" });
    }
}


exports.putMatch = async (req, res) => {
    const { id } = req.params;
    const { usuario1_id, usuario2_id, idioma_comum, status } = req.body;

    const camposValidados = validarCampos(usuario1_id, usuario2_id, idioma_comum, status);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }
    try {
        const response = await matchModel.put({ usuario1_id, usuario2_id, idioma_comum, status, id });

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "Match não encontrado." })
        }


        return res.status(200).json({ message: "Match atualizado com sucesso", response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar match" })
    }
}


exports.deleteMatch = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await matchModel.delete(id);

        res.status(200).json({ message: "Match deletado com sucesso" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o match" })
    }
}

exports.obterMatches = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId);
        
        const matches = await matchService.buscarMatches(userId);
        res.json(matches);
    } catch (error) {
        console.error("erro ao buscar matches: ",error);
        res.status(500).json({ error: "Erro interno do servidor"});
    }
}