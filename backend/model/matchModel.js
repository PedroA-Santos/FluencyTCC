const db = require('../db');

// Listar todos os matches
exports.list = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM matches`, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Listar match por ID
exports.listById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM matches WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Criar novo match
exports.post = ({ usuario1_id, usuario2_id, idioma_comum, status }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO matches (usuario1_id, usuario2_id, idioma_comum, status) VALUES (?, ?, ?, ?)`,
            [usuario1_id, usuario2_id, idioma_comum, status],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

// Atualizar match
exports.put = ({ usuario1_id, usuario2_id, idioma_comum, status, id }) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE matches SET usuario1_id = ?, usuario2_id = ?, idioma_comum = ?, status = ? WHERE id = ?`,
            [usuario1_id, usuario2_id, idioma_comum, status, id],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};

// Deletar match
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM matches WHERE id = ?`, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Buscar matches aceitos por usuário
exports.getMatchesByUserId = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT u.id, m.id AS matchId, u.username, u.bio, u.foto_perfil, p.nome AS pais, i.idioma, u.data_nascimento AS idade
            FROM matches m
            JOIN usuarios u 
                ON (u.id = m.usuario1_id AND m.usuario2_id = ?)
                OR (u.id = m.usuario2_id AND m.usuario1_id = ?)
            LEFT JOIN paises p ON p.id = u.pais_origem_id
            LEFT JOIN idiomas i ON i.id = u.idioma_nativo_id
            WHERE m.status = 'aceito'
        `;
        db.query(sql, [userId, userId], (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Encontrar match entre dois usuários
exports.findMatchEntreUsuarios = (usuario1_id, usuario2_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM matches
            WHERE (usuario1_id = ? AND usuario2_id = ?)
               OR (usuario1_id = ? AND usuario2_id = ?)
        `;
        db.query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar match entre usuários:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Buscar idioma em comum entre dois usuários
exports.getIdiomaComumEntreUsuarios = (usuario1_id, usuario2_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT DISTINCT idiomas.idioma
            FROM (
              SELECT ui2.idioma_id AS idioma
              FROM usuarios_idiomas ui2
              JOIN usuarios u1 ON u1.id = ?
              WHERE ui2.usuario_id = ?
                AND ui2.idioma_id = u1.idioma_nativo_id
          
              UNION
          
              SELECT ui1.idioma_id AS idioma
              FROM usuarios_idiomas ui1
              JOIN usuarios u2 ON u2.id = ?
              WHERE ui1.usuario_id = ?
                AND ui1.idioma_id = u2.idioma_nativo_id
          
              UNION
          
              SELECT ui1.idioma_id AS idioma
              FROM usuarios_idiomas ui1
              JOIN usuarios_idiomas ui2 ON ui1.idioma_id = ui2.idioma_id
              WHERE ui1.usuario_id = ?
                AND ui2.usuario_id = ?
            ) AS idiomas
            LIMIT 1
        `;

        db.query(sql, [usuario1_id, usuario2_id, usuario2_id, usuario1_id, usuario1_id, usuario2_id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar idioma em comum:', err);
                return reject(err);
            }

            if (results.length > 0) {
                resolve(results[0].idioma); // Corrigi: é 'idioma', não 'idioma_id'
            } else {
                resolve(null);
            }
        });
    });
};

// Buscar match específico entre dois usuários
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
