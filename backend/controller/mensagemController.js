const mensagemModel = require('../model/mensagemModel');

const { validarCampos } = require('../utils/validarCampos');


exports.listAll = async (req, res) => {
    try {
        const mensagens = await mensagemModel.list();

        if (mensagens.length === 0) {
            return res.status(404).json({ message: "Nenhum match encontrado" });
        }

        return res.status(200).json(mensagens);
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro ao listar mensagens');
    }
}


exports.listById = async (req, res) => {
   
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const response = await mensagemModel.listById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Mensagem não encontrada" })

        }

        res.status(200).json({ message: "Mensagem encontrada", response });
    } catch (error) {
        console.error(error);
        res.status(500).json('Erro ao listar mensagem');
    }
}


exports.postMensagem = async (req, res) => {
    const { match_id } = req.params; // imagino que o id do match vai ser o id do chat que vai estar na url

    const { remetente_id, destinatario_id, conteudo } = req.body;

    const camposValidados = validarCampos({ match_id, remetente_id, destinatario_id, conteudo });


    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }


    try {
        const response = await mensagemModel.post(match_id, remetente_id, destinatario_id, conteudo);
        res.status(201).json({ message: "Mensagem criada com sucesso", response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao registrar mensagem" });
    }
}


exports.putMensagem = async (req, res) => {
    const { id } = req.params;
    const { match_id, remetente_id, destinatario_id, conteudo } = req.body;

    const camposValidados = validarCampos(match_id, remetente_id, destinatario_id, conteudo);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }
    try {
        const response = await mensagemModel.put({ match_id, remetente_id, destinatario_id, conteudo, id });

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "Mensagem não encontrada." })
        }

        return res.status(200).json({ message: "Mensagem atualizada com sucesso", response });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar mensagem" })
    }
}


exports.deleteMensagem = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await mensagemModel.delete(id);

        res.status(200).json({ message: "Mensagem deletada com sucesso" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o mensagem" })
    }
}