//Este arquivo terá funções para interagir com o banco

// backend/services/chatService.js
const db = require("../db");

const verificarMatch = (matchId, usuarioId, callback) => {
    db.query(
        "SELECT usuario1_id, usuario2_id FROM matches WHERE id = ? AND status = 'aceito'",
        [matchId],
        (err, results) => {
            if (err || results.length === 0) {
                callback(err || new Error("Match inválido ou não aceito"), null);
                return;
            }
            const { usuario1_id, usuario2_id } = results[0];
            if (usuarioId != usuario1_id && usuarioId != usuario2_id) {
                callback(new Error("Você não faz parte deste match"), null);
                return;
            }
            callback(null, { usuario1_id, usuario2_id });
        }
    );
};

const obterHistoricoMensagens = (matchId, callback) => {
    db.query(
        "SELECT remetente_id, conteudo, enviado_em FROM mensagens WHERE match_id = ? ORDER BY enviado_em",
        [matchId],
        (err, resultados) => {
            callback(err, resultados);
        }
    );
};

const salvarMensagem = (matchId, remetenteId, destinatarioId, conteudo, callback) => {
    db.query(
        "INSERT INTO mensagens (match_id, remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?, ?)",
        [matchId, remetenteId, destinatarioId, conteudo],
        (err) => {
            callback(err);
        }
    );
};

module.exports = {
    verificarMatch,
    obterHistoricoMensagens,
    salvarMensagem,
};