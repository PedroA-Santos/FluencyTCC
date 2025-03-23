const db = require('../db');

exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM usuarios_interesses`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT i.id, i.interesse AS interesse 
            FROM usuarios_interesses iu
            INNER JOIN interesses i ON iu.interesse_id = i.id
            WHERE iu.usuario_id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.post = ({ usuario_id, interesse_id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO usuarios_interesses (usuario_id, interesse_id) VALUES (?, ?)`,
            [usuario_id, interesse_id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


exports.put = ({ usuario_id, interesse_id, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE usuarios_interesses SET usuario_id = ?, interesse_id = ? WHERE id = ?`,
            [usuario_id, interesse_id, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM usuarios_interesses WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
