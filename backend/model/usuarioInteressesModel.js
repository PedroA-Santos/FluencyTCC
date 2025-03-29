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

exports.postMultiple = ({ usuario_id, interesses }) => {
    return new Promise((resolve, reject) => {
        console.log("Inserindo múltiplos interesses para o usuário:", usuario_id);

        // Inicia uma transação
        db.beginTransaction((err) => {
            if (err) return reject(err);

            // Executa as inserções dentro da transação
            const insertPromises = interesses.map((interesse_id) => {
                return new Promise((resolve, reject) => {
                    console.log(`Inserindo interesse_id ${interesse_id} para usuario_id ${usuario_id}`);

                    db.query(
                        `INSERT INTO usuarios_interesses (usuario_id, interesse_id) VALUES (?, ?)`,
                        [usuario_id, interesse_id],
                        (err, results) => {
                            if (err) {
                                return db.rollback(() => reject(err)); // Rollback em caso de erro
                            }
                            console.log(`Interesse ${interesse_id} inserido com sucesso.`);
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
                        resolve("Todos os interesses inseridos com sucesso.");
                    });
                })
                .catch((err) => {
                    // Rollback caso algum erro ocorra
                    db.rollback(() => reject(err));
                });
        });
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


exports.delete = ({ usuario_id }) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM usuarios_interesses WHERE usuario_id = ?`, [usuario_id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
