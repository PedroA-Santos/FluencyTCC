const paisModel = require('../model/paisModel');
const { validarCampos } = require("../utils/validarCampos");


exports.listAll = async (req, res) => {

    try {
        const paises = await paisModel.list();

        if (paises.length === 0) {
            return res.status(404).json({ message: "Nenhum país encontrado" })
        }

        return res.status(200).json(paises);
    } catch (error) {

        console.error("Erro no getAll do país", error);
        res.status(500).json({ message: "erro ao listar país" })
    }
}


exports.listById = async (req, res) => {


    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {
        const pais = await paisModel.listFindById(id);

        if (!pais) {
            return res.status(404).json({ message: "País não encontrado" })
        }

        return res.status(200).json(pais);
    } catch (error) {
        console.error("Erro ao listar país pelo ID", error);
        res.status(500).json({ message: "Erro ao listar país" })
    }
}


exports.listByNome = async (req, res) => {

    const { nome } = req.params;

    if (!nome) {
        return res.status(400).json({ message: "Nome do país ausente." });
    }

    try {

        const response = await paisModel.listByNome(nome);
        if (!response) {
            return res.status(404).json({ message: "País não encontrado" })
        }

        return res.status(200).json(response);
    } catch (error) {
        console.error("Erro ao listar país pelo nome", error);
        res.status(500).json({ message: "Erro ao listar país" })

    }
}


exports.postPais = async (req, res) => {

    const { nome } = req.body;

    camposValidados = validarCampos({ nome });

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }

    try {
        const response = await paisModel.post({ nome });

        return res.status(201).json({ message: "País criado com sucesso", response });

    } catch (error) {
        console.error("Erro ao criar país", error);
        res.status(500).json({ message: "Erro ao criar país" })
    }
}


exports.putPais = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    camposValidados = validarCampos({ nome });

    if (!camposValidados) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }



    try {

        const response = await paisModel.put({ id, nome });

        if (!response) {
            return res.status(404).json({ message: "País não encontrado" })
        }

        return res.status(200).json({ message: "País atualizado com sucesso", response });

    } catch (error) {

        console.error("Erro ao atualizar país", error);
        res.status(500).json({ message: "Erro ao atualizar país" })

    }
}


exports.deletePais = async (req, res) => {

    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ message: "ID inválido ou ausente." });
    }

    try {

        await paisModel.delete(id);
        return res.status(200).json({ message: "País deletado com sucesso" });

    } catch (error) {
        console.error("Erro ao deletar país", error);
        res.status(500).json({ message: "Erro ao deletar país" });

    }
}