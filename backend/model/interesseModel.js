const db = require('../db');

exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM interesses`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.listById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM interesses WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

exports.post = (interesse) => {
    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO interesses (interesse) VALUES (?)`, [interesse], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.put = ({ interesse, id }) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE interesses SET interesse = ? WHERE id = ?`, [interesse, id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM interesses WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
