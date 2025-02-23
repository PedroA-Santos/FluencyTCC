const db = require('../db');


exports.list = () => {

    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM mensagens`, (err, results) => {
            if (err) return reject(err);
            resolve(results)
        })

    })

}


exports.listById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM mensagens WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    })
}


exports.post = ({ match_id, remetente_id, destinatario_id, conteudo }) => {

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO mensagens (match_id, remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?, ?)`,
            [match_id, remetente_id, destinatario_id, conteudo],
            (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })

}


exports.put = ({ match_id, remetente_id, destinatario_id, conteudo, id }) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE mensagens SET match_id = ?, remetente_id = ?, destinatario_id = ?, conteudo = ? WHERE id = ? `,
            [match_id, remetente_id, destinatario_id, conteudo, id],
            (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })
}


exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM mensagens WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results)
        })
    })
}