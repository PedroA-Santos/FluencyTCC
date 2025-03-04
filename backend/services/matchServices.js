// services/matchService.js
const db = require("../db");

exports.buscarMatches = async (userId) => {
    // Retorna uma nova Promise para que possamos usar async/await corretamente
    return new Promise((resolve, reject) => {
        // Buscar idioma nativo
        db.query(`
            SELECT idioma_nativo_id FROM usuarios WHERE id = ?
        `, [userId], (error, userData) => {
            if (error) return reject(error);

            // Buscar idiomas que o usuário quer aprender
            db.query(`
                SELECT idioma_id FROM usuarios_idiomas WHERE usuario_id = ?
            `, [userId], (error, idiomasAprendidos) => {
                if (error) return reject(error);

                if (!userData || idiomasAprendidos.length === 0) {
                    return resolve([]);
                }

                const idiomaNativo = userData[0].idioma_nativo_id;
                const idiomasQuerAprender = idiomasAprendidos.map(row => row.idioma_id);

                // Buscar matches
                db.query(`
                    SELECT DISTINCT u.id, u.username, u.bio, u.foto_perfil, ui.idioma_id, ui.nivel
                    FROM usuarios u
                    JOIN usuarios_idiomas ui ON u.id = ui.usuario_id
                    WHERE 
                        (
                            -- Buscar usuários que falam nativamente o idioma que o usuário quer aprender
                            ui.idioma_id IN (?)
                            AND u.idioma_nativo_id = ui.idioma_id
                        )
                        OR 
                        (
                            -- Buscar usuários que já têm um nível intermediário ou avançado
                            ui.idioma_id IN (?)
                            AND ui.nivel IN ('Intermediário', 'Avançado')
                        )
                        OR 
                        (
                            -- Buscar usuários que também querem aprender o mesmo idioma
                            ui.idioma_id IN (?)
                            AND ui.nivel = 'Básico'
                        )
                    AND u.id != ? -- Evitar sugerir o próprio usuário
                    `, [idiomasQuerAprender, idiomasQuerAprender, idiomasQuerAprender, userId], (error, matches) => {
                    if (error) return reject(error);
                    resolve(matches);
                });
            });
        });
    });
};
