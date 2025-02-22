const interesseModel = require('../model/interesseModel');
const { validarCampos } = require('../utils/validarCampos');


exports.listAll = async (req, res) => {
    try {
        const interesses = await interesseModel.list();

        if (interesses.length === 0) {
            return res.status(404).json({ message: "Nenhum interesse encontrado" });
        }

        return res.status(200).json(interesses);
    } catch (error) {
        console.error('Erro ao listar interesses', error);
        res.status(500).json('Erro ao listar interesses');
    }



}



exports.listById = async (req, res) => {
    const { id } = req.params;


    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const response = await interesseModel.listById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Interesse não encontrada" })

        }

        res.status(200).json({ message: "Interesse encontrado", response });
    } catch (error) {
        console.error('Erro ao listar interesse', error);
        res.status(500).json('Erro ao listar interesse');
    }
}




exports.postInteresse = async (req, res) => {
    const { interesse } = req.body;

    const camposValidados = validarCampos({ interesse });


    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }


    try {
        const response = await interesseModel.post({ interesse });
        res.status(201).json({ message: "Interesse criado com sucesso", response });

    } catch (error) {
        console.error("Erro ao criar Interesse", error);
        res.status(500).json({ message: "Erro ao cadastrar interesse" });
    }

}


exports.putInteresse = async (req, res) => {
    const { id } = req.params;
    const { interesse } = req.body;

    const camposValidados = validarCampos({ interesse });

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }
    try {
        const response = await interesseModel.put({ interesse, id });

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "Cliente não encontrado." })

        }


        return res.status(200).json({ message: "interesse atualizado com sucesso", response });

    } catch (error) {
        console.error("Erro ao atualizar o interesse", error);
        res.status(500).json({ message: "Erro ao atualizar o interesse" })
    }


}



exports.deleteInteresse = async (req, res) => {

    const { id } = req.params;


    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await interesseModel.delete(id);

        res.status(200).json({ message: "Interesse deletado com sucesso" })
    } catch (error) {
        console.error("Erro ao deletar Interesse", error);
        res.status(500).json({ message: "Erro ao deletar o Interesse" })
    }



}