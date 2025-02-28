const db = require('../db');



exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM generos`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};


exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM generos WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results.length > 0 ? results[0] : null);
        });
    });
};




exports.post = ({ nome }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO generos (nome) VALUES (?)`,
            [nome],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


exports.put = ({ id, nome }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE generos SET nome = ? WHERE id = ?`,
            [nome, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};



exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM generos WHERE id = ?`,
            [id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};