const db = require('../db');




exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM paises', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })
}


exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM paises WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};



exports.listByNome = (nome) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM paises WHERE nome = ?', [nome], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
};



exports.post = ({ nome }) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO paises (nome) VALUES (?);',
            [nome],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}




exports.put = ({ nome, id }) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE paises SET nome = ? WHERE id = ?',
            [nome, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}


exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM paises WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })
}