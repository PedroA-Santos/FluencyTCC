const db = require('../db');


exports.list = () => {

    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM matches`, (err, results) => {
            if (err) return reject(err);
            resolve(results)
        })

    })

}


exports.listById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM matches WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });

    })
}


exports.post = ({ usuario1_id, usuario2_id, idioma_comum, status }) => {

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO matches (usuario1_id, usuario2_id, idioma_comum, status) VALUES (?, ?, ?, ?)`,
            [usuario1_id, usuario2_id, idioma_comum, status],
            (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })

}


exports.put = ({ usuario1_id, usuario2_id, idioma_comum, status, id }) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE matches SET usuario1_id = ?, usuario2_id = ?, idioma_comum = ?, status = ? WHERE id = ? `, [usuario1_id, usuario2_id, idioma_comum, status, id], (err, results) => {
            if (err) return reject(err)
            resolve(results);
        })
    })
}


exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM matches WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results)
        })
    })
}

//matches ACEITOS onde userId está como usuario1_id || usuario2_id - *exclui o proprio usuario da lista*
exports.getMatchesByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT u.id, u.username, u.bio, u.foto_perfil
            FROM matches m
            JOIN usuarios u ON (u.id = m.usuario1_id OR u.id = m.usuario2_id)
            WHERE (m.usuario1_id = ? OR m.usuario2_id = ?)
            AND m.status = 'aceito'
            AND u.id != ?`,
            [userId, userId, userId],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}