const db = require('../db');

exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM usuarios_idiomas`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM usuarios_idiomas WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};

exports.post = (usuario_id, idioma_id, nivel) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO usuarios_idiomas (usuario_id, idioma_id, nivel) VALUES (?, ?, ?)`,
            [usuario_id, idioma_id, nivel],
            (err, results) => {
                if (err) return reject(err);
                resolve({ id: results.insertId, usuario_id, idioma_id, nivel });
            }
        );
    });
};

exports.put = (usuario_id, idioma_id, nivel, id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE usuarios_idiomas SET usuario_id = ?, idioma_id = ?, nivel = ? WHERE id = ?`,
            [usuario_id, idioma_id, nivel, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM usuarios_idiomas WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
