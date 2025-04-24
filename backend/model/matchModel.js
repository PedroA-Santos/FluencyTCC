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
        const sql = `
            SELECT DISTINCT u.id, u.username, u.bio, u.foto_perfil
            FROM matches m
            JOIN usuarios u 
                ON (u.id = m.usuario1_id AND m.usuario2_id = ?)
                OR (u.id = m.usuario2_id AND m.usuario1_id = ?)
            WHERE m.status = 'aceito'
        `;

        db.query(sql, [userId, userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};




//Ela busca um match entre dois usuários, em qualquer ordem (usuário1 com usuário2 ou usuário2 com usuário1), garantindo que um match recíproco seja detectado corretamente.
exports.findMatchEntreUsuarios = (usuario1_id, usuario2_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM matches
            WHERE (usuario1_id = ? AND usuario2_id = ?)
               OR (usuario1_id = ? AND usuario2_id = ?)
        `;

        db.query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id], (err, result) => {
            if (err) {
                console.error('Erro ao buscar match entre usuários:', err);
                return reject(err);
            }
            resolve(result);
        });
    });
};


//busca o idioma em comum entre os usuários na hora da criação do match
exports.getIdiomaComumEntreUsuarios = (usuario1_id, usuario2_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT ui1.idioma_id
            FROM usuarios_idiomas ui1
            JOIN usuarios_idiomas ui2 ON ui1.idioma_id = ui2.idioma_id
            WHERE ui1.usuario_id = ? AND ui2.usuario_id = ?
            LIMIT 1
        `;

        db.query(sql, [usuario1_id, usuario2_id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar idioma em comum:', err);
                return reject(err);
            }

            if (results.length > 0) {
                resolve(results[0].idioma_id); // Retorna o ID do idioma em comum
            } else {
                resolve(null); // Nenhum idioma em comum
            }
        });
    });
};


exports.getMatchEntreUsuarios = (usuario1_id, usuario2_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM matches
            WHERE 
                (usuario1_id = ? AND usuario2_id = ?) OR
                (usuario1_id = ? AND usuario2_id = ?)
            LIMIT 1
        `;

        db.query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};



