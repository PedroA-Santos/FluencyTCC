const db = require("../db");

exports.buscarMatches = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(`
            SELECT DISTINCT u.id,
                COALESCE((
                    SELECT COUNT(*) 
                    FROM usuarios_interesses ui1
                    JOIN usuarios_interesses ui2 
                        ON ui1.interesse_id = ui2.interesse_id 
                    WHERE ui1.usuario_id = ? AND ui2.usuario_id = u.id
                ), 0) AS interesses_em_comum
            FROM usuarios u
            WHERE 
                (
                    -- Condição: Troca direta de idiomas
                    u.id IN (
                        SELECT usuario_id 
                        FROM usuarios_idiomas 
                        WHERE idioma_id IN (
                            SELECT idioma_nativo_id 
                            FROM usuarios 
                            WHERE id = ?
                        )
                    )
                    AND ? IN (
                        SELECT usuario_id 
                        FROM usuarios_idiomas 
                        WHERE idioma_id IN (
                            SELECT idioma_nativo_id 
                            FROM usuarios 
                            WHERE id = u.id
                        )
                    )
                )
                OR 
                (
                    -- Condição: Ambos estão aprendendo o mesmo idioma
                    u.id IN (
                        SELECT usuario_id 
                        FROM usuarios_idiomas 
                        WHERE idioma_id IN (
                            SELECT idioma_id 
                            FROM usuarios_idiomas 
                            WHERE usuario_id = ?
                        )
                    )
                )
            AND u.id != ? -- Excluir o próprio usuário
            ORDER BY interesses_em_comum DESC;
        `, [userId, userId, userId, userId, userId, userId], (error, rows) => {
            if (error) {
                console.error("Erro ao buscar IDs dos matches:", error);
                return reject(error);
            }

            const userIds = rows.map(row => row.id);

            if (userIds.length === 0) {
                return resolve([]);
            }

            // 2ª Consulta: Buscar informações completas dos usuários sugeridos
            const placeholders = userIds.map(() => '?').join(',');
            db.query(`
                    SELECT 
                        u.id, 
                        u.username, 
                        u.foto_perfil, 
                        u.idioma_nativo_id,
                        COALESCE(GROUP_CONCAT(DISTINCT i.idioma SEPARATOR ', '), '') AS idiomas_aprendendo,
                        COALESCE(GROUP_CONCAT(DISTINCT inter.interesse SEPARATOR ', '), '') AS interesses
                    FROM usuarios u
                    LEFT JOIN usuarios_idiomas ui ON u.id = ui.usuario_id
                    LEFT JOIN idiomas i ON ui.idioma_id = i.id
                    LEFT JOIN usuarios_interesses ui2 ON u.id = ui2.usuario_id
                    LEFT JOIN interesses inter ON ui2.interesse_id = inter.id
                    WHERE u.id IN (${placeholders})
                    GROUP BY u.id
                    ORDER BY FIELD(u.id, ${userIds.map(() => '?').join(',')});
                `, [...userIds, ...userIds], (error, users) => {
                if (error) {
                    console.error("Erro ao buscar informações dos usuários:", error);
                    return reject(error);
                }

                resolve(users);
            });

        });
    });
};
