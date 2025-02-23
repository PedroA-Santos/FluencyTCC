const usuarioIdiomaModel = require('../model/usuarioIdiomasModel');
const { validarCampos } = require('../utils/validarCampos')


exports.listAll = async (req, res) => {

    try {
        const usuarioIdiomas = await usuarioIdiomaModel.list();

        if (usuarioIdiomas.length === 0) {
            return res.status(404).json({ message: "Nenhum idioma encontrado" })
        }

        return res.status(200).json(usuarioIdiomas);
    } catch (error) {
        console.error("Erro no getAll do usuarioIdioma", error);
        res.status(500).json({ message: "erro ao listar idiomas do usuário" })
    }

}


exports.listById = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }



    try {

        const response = await usuarioIdiomaModel.listFindById(id);

        if (response.length === 0) {
            return res.status(404).json({ message: "Nenhum idioma do usuário encontrado" })
        }

        return res.status(200).json(response);


    } catch (error) {

        console.error("Erro ao listar idioma do usuário pelo ID", error);
        res.status(500).json({ message: "Erro ao listar idioma do usuário" })

    }

}



exports.postUsuarioIdioma = async (req, res) => {


    const { usuario_id, idioma_id, nivel } = req.body;

    const camposValidados = validarCampos({ usuario_id, idioma_id, nivel });


    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }


    try {

        const response = await usuarioIdiomaModel.post(usuario_id, idioma_id, nivel);

        return res.status(201).json({ message: "Idioma do usuário criado com sucesso", response });

    } catch (error) {
        console.error("Erro ao criar idioma do usuario", error);
        res.status(500).json({ message: "Erro ao criar idioma do usuário" })
    }
}




exports.putUsuarioIdioma = async (req, res) => {
    const { id } = req.params;
    const { usuario_id, idioma_id, nivel } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    const camposValidados = validarCampos({ usuario_id, idioma_id, nivel, id });

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }



    try {
        const response = await usuarioIdiomaModel.put(usuario_id, idioma_id, nivel);

        if (response.affectedRows === 0) {
            return res.status(404).json({ message: "idioma do usuário não encontrado." })

        }

        return res.status(200).json({ message: "Idioma do usuário atualizado com sucesso", response });
    } catch (error) {

        console.error("Erro ao atualizar idioma do usuário", error);
        res.status(500).json({ message: "Erro ao atualizar idioma do usuário" })

    }


}



exports.deleteUsuarioIdioma = async (req, res) => {


    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        await usuarioIdiomaModel.delete(id);
        return res.status(200).json({ message: "Idioma do usuário deletado com sucesso" })
    } catch (error) {
        console.error("Erro ao deletar idioma do usuário", error);
        res.status(500).json({ message: "Erro ao deletar idioma do usuário" });
    }

}