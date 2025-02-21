const db = require('../db');



exports.list = () => {

    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM idiomas`, (err, results) => {
            if (err) return reject(err);
            resolve(results

            )
        })

    })

}

exports.listById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM idiomas WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });

    })
}


exports.post = (idioma) => {

    return new Promise((resolve, reject) => {
        db.query(`INSERT INTO idiomas (idioma) VALUES (?)`, [idioma], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })

}



exports.put = (idioma, id) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE idiomas SET idioma = ? WHERE id = ? `, [idioma, id], (err, results) => {
            if (err) return reject(err)
            resolve(results);

        })
    })
}


exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM idiomas WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results)
        })
    })
}