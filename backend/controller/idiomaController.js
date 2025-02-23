const idiomaModel = require('../model/idiomaModel');

const { validarCampos } = require('../utils/validarCampos');


exports.listAll = async (req, res) => {
    try {
        const idiomas = await idiomaModel.list();

        if (idiomas.length === 0) {
            return res.status(404).json({ message: "Nenhum idioma encontrado" });
        }

        return res.status(200).json(idiomas);
    } catch (error) {
        console.error('Erro ao listar idiomas', error);
        res.status(500).json('Erro ao listar idiomas');
    }



}



exports.listById = async (req, res) => {
    const { id } = req.params;


    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const response = await idiomaModel.listById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Idioma não encontrada" })

        }

        res.status(200).json({ message: "Idioma encontrado", response });
    } catch (error) {
        console.error('Erro ao listar idioma', error);
        res.status(500).json('Erro ao listar idioma');
    }
}




exports.postIdioma = async (req, res) => {
    const { idioma } = req.body;

    const camposValidados = validarCampos({ idioma });


    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }


    try {
        const response = await idiomaModel.post(idioma);
        res.status(201).json({ message: "Idioma criado com sucesso", response });

    } catch (error) {
        console.error("Erro ao criar idioma", error);
        res.status(500).json({ message: "Erro ao cadastrar idioma" });
    }

}


exports.putIdioma = async (req, res) => {
    const { id } = req.params;
    const { idioma } = req.body;

    console.log('====================================');
    console.log(id, idioma);
    console.log('====================================');

    const camposValidados = validarCampos(idioma);

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }
    try {
        const response = await idiomaModel.put({ idioma, id });

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "Idioma não encontrado." })

        }


        return res.status(200).json({ message: "Idioma atualizado com sucesso", response });

    } catch (error) {
        console.error("Erro ao atualizar o idioma", error);
        res.status(500).json({ message: "Erro ao atualizar o idioma" })
    }


}



exports.deleteIdioma = async (req, res) => {

    const { id } = req.params;


    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await idiomaModel.delete(id);

        res.status(200).json({ message: "Idioma deletado com sucesso" })
    } catch (error) {
        console.error("Erro ao deletar idioma", error);
        res.status(500).json({ message: "Erro ao deletar o idioma" })
    }



}