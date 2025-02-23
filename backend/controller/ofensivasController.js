const ofensivasModel = require('../model/ofensivasModel');
const { validarCampos } = require("../utils/validarCampos");


exports.listAll = async (req, res) => {

    try {
        const ofensivas = await ofensivasModel.list();

        if (ofensivas.length === 0) {
            return res.status(404).json({ message: "Nenhum ofensiva encontrada" })
        }

        return res.status(200).json(ofensivas);
    } catch (error) {
        console.error("Erro no getAll do ofensivas", error);
        res.status(500).json({ message: "erro ao listar ofensiva do usuário" })
    }

}


exports.listById = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }



    try {

        const response = await ofensivasModel.listFindById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Nenhum ofensiva do usuário encontrado" })
        }

        return res.status(200).json(response);


    } catch (error) {

        console.error("Erro ao listar ofensivas do usuário pelo ID", error);
        res.status(500).json({ message: "Erro ao listar ofensivas do usuário" })

    }

}



exports.postOfensivas = async (req, res) => {


    const { usuario_id, idioma_id, dias_seguidos, ultima_atividade } = req.body;

    const camposValidados = validarCampos({ usuario_id, idioma_id, dias_seguidos, ultima_atividade });


    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }


    try {

        const response = await ofensivasModel.post(usuario_id, idioma_id, dias_seguidos, ultima_atividade);

        return res.status(201).json({ message: "ofensiva do usuário criado com sucesso", response });

    } catch (error) {
        console.error("Erro ao criar ofensiva do usuario", error);
        res.status(500).json({ message: "Erro ao criar ofensiva do usuário" })
    }
}




exports.putOfensivas = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, idioma_id, dias_seguidos, ultima_atividade } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    const camposValidados = validarCampos({ usuario_id, idioma_id, dias_seguidos, ultima_atividade });

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }



    try {
        const response = await ofensivasModel.put(id, usuario_id, idioma_id, dias_seguidos, ultima_atividade);


        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "ofensiva do usuário não encontrada." })

        }

        return res.status(200).json({ message: "ofensiva do usuário atualizado com sucesso", response });
    } catch (error) {

        console.error("Erro ao atualizar ofensiva do usuário", error);
        res.status(500).json({ message: "Erro ao atualizar ofensiva do usuário" })

    }


}



exports.deleteOfensivas = async (req, res) => {


    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await ofensivasModel.delete(id);
        return res.status(200).json({ message: "Ofensiva do usuário deletado com sucesso" })
    } catch (error) {
        console.error("Erro ao deletar Ofensiva do usuário", error);
        res.status(500).json({ message: "Erro ao deletar Ofensiva do usuário" });
    }

}