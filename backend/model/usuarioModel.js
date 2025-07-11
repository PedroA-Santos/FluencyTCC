const db = require("../db");

exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        })
    })
}

exports.listFindById = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE id = ?', [id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}

//Busca o usuario a partir do email para realizar o login
exports.listByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuarios WHERE email = ?',
            [email],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}

exports.post = (username, email, senha, bio, foto_perfil) => {
    return new Promise((resolve, reject) => {
        db.query('INSERT INTO usuarios (username, email, senha, bio, foto_perfil) VALUES (?, ?, ?, ?, ?)',
            [username, email, senha, bio, foto_perfil],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}

exports.put = (username, email, senha, bio, foto_perfil, id) => {
    return new Promise((resolve, reject) => {
        db.query('UPDATE usuarios SET username = ?, email = ?, senha = ?, bio = ?, foto_perfil = ? WHERE id = ?',
        [username, email, senha, bio, foto_perfil, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}

exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM usuarios WHERE id = ?',
            [id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        )
    })
}