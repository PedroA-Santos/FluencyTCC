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
                        (ui.idioma_id IN (?) AND ui.nivel = 'Avançado' AND u.id != ?) 
                        OR 
                        (u.idioma_nativo_id IN (?) AND u.id != ?)
                `, [idiomasQuerAprender, userId, idiomaNativo, userId], (error, matches) => {
                    if (error) return reject(error);
                    resolve(matches);
                });
            });
        });
    });
};
