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
        db.query(`SELECT i.id, i.idioma AS idioma 
            FROM usuarios_idiomas iu
            INNER JOIN idiomas i ON iu.idioma_id = i.id
            WHERE iu.usuario_id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.post = ({ usuario_id, idioma_id, nivel }) => {
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


exports.postMultiple = ({ usuario_id, idiomas }) => {
    return new Promise((resolve, reject) => {
        console.log("Inserindo múltiplos idiomas para o usuário:", usuario_id);

        // Inicia uma transação
        db.beginTransaction((err) => {
            if (err) return reject(err);

            // Executa as inserções dentro da transação
            const insertPromises = idiomas.map((idioma_id) => {
                return new Promise((resolve, reject) => {
                    console.log(`Inserindo idioma_id ${idioma_id} para usuario_id ${usuario_id}`);

                    db.query(
                        `INSERT INTO usuarios_idiomas (usuario_id, idioma_id) VALUES (?, ?)`,
                        [usuario_id, idioma_id],
                        (err, results) => {
                            if (err) {
                                return db.rollback(() => reject(err)); // Rollback em caso de erro
                            }
                            console.log(`Idioma ${idioma_id} inserido com sucesso.`);
                            resolve(results);
                        }
                    );
                });
            });

            // Aguarda todas as inserções
            Promise.all(insertPromises)
                .then(() => {
                    // Se todas as inserções forem bem-sucedidas, faz o commit
                    db.commit((err) => {
                        if (err) {
                            return db.rollback(() => reject(err)); // Rollback em caso de erro no commit
                        }
                        resolve("Todos os idiomas inseridos com sucesso.");
                    });
                })
                .catch((err) => {
                    // Rollback caso algum erro ocorra
                    db.rollback(() => reject(err));
                });
        });
    });
};


exports.put = ({ usuario_id, idioma_id, nivel, id }) => {
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

exports.delete = ({ usuario_id }) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM usuarios_idiomas WHERE usuario_id = ?`, [usuario_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
