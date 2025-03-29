const usuarioInteresseModel = require('../model/usuarioInteressesModel');
const { validarCampos } = require("../utils/validarCampos");


exports.listAll = async (req, res) => {

    try {
        const usuarioInteresses = await usuarioInteresseModel.list();

        if (usuarioInteresses.length === 0) {
            return res.status(404).json({ message: "Nenhum interesse encontrado" })
        }

        return res.status(200).json(usuarioInteresses);
    } catch (error) {
        console.error("Erro no getAll do usuariointeresse", error);
        res.status(500).json({ message: "erro ao listar Interesses do usuário" })
    }

}


exports.listById = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }



    try {

        const response = await usuarioInteresseModel.listFindById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Nenhum interesse do usuário encontrado" })
        }

        return res.status(200).json(Array.isArray(response) ? response : [response]);;


    } catch (error) {

        console.error("Erro ao listar interesse do usuário pelo ID", error);
        res.status(500).json({ message: "Erro ao listar interesse do usuário" })

    }

}



exports.postUsuarioInteresse = async (req, res) => {
    const { usuario_id } = req.params;
    const { interesses } = req.body;  // Agora recebe um array de interesses

    console.log("ID do Usuário:", usuario_id);
    console.log("Interesses recebidos:", interesses);

    // Verifique se o usuário_id e os interesses estão presentes
    if (!usuario_id || !Array.isArray(interesses) || interesses.length === 0) {
        return res.status(400).json({ message: "Usuário e interesses são obrigatórios" });
    }

    try {
        console.log("Chamando o modelo para inserir interesses...");

        // Chama a função no modelo para inserir múltiplos interesses
        const response = await usuarioInteresseModel.postMultiple({ usuario_id, interesses });

        console.log("Interesses inseridos no banco de dados com sucesso!", response);

        return res.status(201).json({
            message: "Interesses do usuário criados com sucesso!",
            response,
        });
    } catch (error) {
        console.error("Erro ao criar interesses do usuário", error);
        return res.status(500).json({ message: "Erro ao criar interesses do usuário" });
    }
};




exports.putUsuarioInteresse = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, interesse_id } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    const camposValidados = validarCampos({ usuario_id, interesse_id, id });

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }



    try {
        const response = await usuarioInteresseModel.put({ usuario_id, interesse_id, id });

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "interesse do usuário não encontrado." })

        }

        return res.status(200).json({ message: "interesse do usuário atualizado com sucesso", response });
    } catch (error) {

        console.error("Erro ao atualizar interesse do usuário", error);
        res.status(500).json({ message: "Erro ao atualizar interesse do usuário" })

    }


}



exports.deleteUsuarioInteresse = async (req, res) => {


    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await usuarioInteresseModel.delete(id);
        return res.status(200).json({ message: "Interesse do usuário deletado com sucesso" })
    } catch (error) {
        console.error("Erro ao deletar Interesse do usuário", error);
        res.status(500).json({ message: "Erro ao deletar Interesse do usuário" });
    }

}