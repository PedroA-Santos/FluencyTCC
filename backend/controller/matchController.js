const matchModel = require('../model/matchModel');
const matchService = require("../services/matchServices");
const db = require("../db") ///importa o serviço de sugestão de usuarios - ainda deve ser melhorado

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

//busca os matches ja aceitos
exports.getUserMatches = async (req, res) => {
    const { userId } = req.params // PROVISÓRIO, deve ser da seguinte maneira depois que obtivermos token de user - req.user.id



    if (!userId || isNaN(Number(userId))) {
        console.log(userId);
        return res.status(400).json({ message: "ID inválido ou ausente." })
    }

    try {
        const matches = await matchModel.getMatchesByUserId(userId);
        res.status(200).json(matches);
    } catch (error) {
        console.error('erro ao buscar matches', error);
        res.status(500).json({ message: "Erro ao buscar matches." });
    }
}

//obtém as sugestões de matches
exports.obterMatches = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("id do user: '", userId, "'");

        const matches = await matchService.buscarMatches(userId);

        // Filtrar sugestões que já têm match aceito
        const matchesFiltrados = (
            await Promise.all(matches.map(async (user) => {
                const match = await matchModel.getMatchEntreUsuarios(userId, user.id);
                console.log(`[DBG] Sugestão user_id: ${user.id}, match:`, match);
                if (match && match.status === 'aceito') {
                    console.warn(`[DBG] AVISO: Usuário ${user.id} com match aceito sugerido indevidamente!`);
                    return null; // remove da lista
                }
                return user; // mantém na lista
            }))
        ).filter(Boolean); // remove os nulls

        res.json(matchesFiltrados);

    } catch (error) {
        console.error("erro ao buscar matches: ", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}




//funçaõ que cria o match para se tornar um match aceito
// controllers/matchController.js
exports.aceitarOuCriarMatch = async (req, res) => {
    const { usuario1_id, usuario2_id } = req.body;

    try {
        console.log("[aceitarOuCriarMatch] Iniciando:", { usuario1_id, usuario2_id });

        const idioma_comum = await matchModel.getIdiomaComumEntreUsuarios(usuario1_id, usuario2_id);
        if (!idioma_comum) {
            return res.status(400).json({ message: "Usuários não têm idioma em comum." });
        }

        const matchExistente = await matchModel.getMatchEntreUsuarios(usuario1_id, usuario2_id);
        console.log("[aceitarOuCriarMatch] Match existente:", matchExistente);

        if (matchExistente) {
            if (matchExistente.status === "aceito") {
                console.log("[aceitarOuCriarMatch] Match já aceito");
                return res.status(200).json({ message: "Match já aceito.", matchId: matchExistente.id });
            }
            if (matchExistente.status === "pendente") {
                await matchModel.put({
                    id: matchExistente.id,
                    usuario1_id: matchExistente.usuario1_id,
                    usuario2_id: matchExistente.usuario2_id,
                    idioma_comum,
                    status: "aceito",
                });
                console.log("[aceitarOuCriarMatch] Match aceito:", matchExistente.id);
                return res.status(200).json({ message: "Match aceito com sucesso.", matchId: matchExistente.id });
            }
            if (matchExistente.status === "rejeitado") {
                // Redefinir usuario1_id como quem está iniciando a solicitação
                await matchModel.put({
                    id: matchExistente.id,
                    usuario1_id: usuario1_id,
                    usuario2_id: usuario2_id,
                    idioma_comum,
                    status: "pendente",
                });
                console.log("[aceitarOuCriarMatch] Match rejeitado alterado para pendente:", matchExistente.id);
                return res.status(200).json({ message: "Match pendente criado com sucesso.", matchId: matchExistente.id });
            }
        }

        const novoMatch = await matchModel.post({
            usuario1_id,
            usuario2_id,
            idioma_comum,
            status: "pendente",
        });
        console.log("[aceitarOuCriarMatch] Novo match pendente criado:", novoMatch.insertId);
        return res.status(201).json({
            message: "Match pendente criado com sucesso.",
            matchId: novoMatch.insertId,
        });
    } catch (error) {
        console.error("[aceitarOuCriarMatch] Erro:", error);
        return res.status(500).json({ message: "Erro ao criar ou aceitar match." });
    }
};

exports.desfazerMatch = async (req, res) => {
    const { matchId } = req.params;
    const { usuarioId } = req.body;

    try {
        // Buscar o match pelo ID
        const match = await matchModel.listById(matchId);

        if (!match) {
            return res.status(404).json({ message: "Match não encontrado." });
        }

        // Verificar se o usuário é parte do match
        if (match.usuario1_id !== usuarioId && match.usuario2_id !== usuarioId) {
            return res.status(403).json({ message: "Você não tem permissão para desfazer este match." });
        }

        // Verificar se o match já está rejeitado
        if (match.status === "rejeitado") {
            return res.status(400).json({ message: "Match já está rejeitado." });
        }

        // Atualizar o status do match para "rejeitado"
        await matchModel.put({
            id: matchId,
            usuario1_id: match.usuario1_id,
            usuario2_id: match.usuario2_id,
            idioma_comum: match.idioma_comum,
            status: "rejeitado"
        });

        return res.status(200).json({ message: "Match desfeito com sucesso." });
    } catch (error) {
        console.error("Erro ao desfazer match:", error);
        return res.status(500).json({ message: "Erro interno ao desfazer match." });
    }
};