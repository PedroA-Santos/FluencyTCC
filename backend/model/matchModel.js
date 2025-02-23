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
        db.query(`INSERT INTO  (usuario1_id, usuario2_id, idioma_comum, status) VALUES (?, ?, ?, ?)`,
            [usuario1_id, usuario2_id, idioma_comum, status],
            (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })

}


exports.put = ({ usuario1_id, usuario2_id, idioma_comum, status }) => {
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