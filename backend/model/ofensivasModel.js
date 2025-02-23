const db = require('../db');

exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ofensivas`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM ofensivas WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

exports.post = ({ usuario_id, idioma_id, dias_seguidos }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO ofensivas (usuario_id, idioma_id, dias_seguidos, ultima_atividade) VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
            [usuario_id, idioma_id, dias_seguidos],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


exports.put = ({ id, usuario_id, idioma_id, dias_seguidos }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE ofensivas SET usuario_id = ?, idioma_id = ?, dias_seguidos = ?, ultima_atividade = CURRENT_TIMESTAMP WHERE id = ?`,
            [usuario_id, idioma_id, dias_seguidos, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ofensivas WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
