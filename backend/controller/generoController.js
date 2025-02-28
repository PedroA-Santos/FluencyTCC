const generoModel = require('../model/generoModel');

exports.listAll = async (req, res) => {

    try {
        const generos = await generoModel.list();

        if (!generos) {
            return res.status(404).json({ message: 'Nenhum gênero encontrado' });
        }

        res.json(generos);
    } catch (error) {

    }

};



exports.listFindById = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await generoModel.listFindById(id);
        if (!response) {
            return res.status(404).json({ message: 'Gênero não encontrado' });
        }
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar gênero' });
        console.error("Erro ao listar Genero", error);
    }

}



exports.post = async (req, res) => {
    const { genero } = req.body;
    try {
        const response = await generoModel.post(response);
        res.status(201).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar gênero' });
        console.error("Erro ao criar Genero", error);
    }
};


exports.put = async (req, res) => {
    const { id } = req.params;
    const { genero } = req.body;
    try {
        const response = await generoModel.put(id, genero);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar gênero' });
        console.error("Erro ao atualizar Genero", error);
    }
};


exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await generoModel.delete(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar gênero' });
        console.error("Erro ao deletar Genero", error);
    }
};

