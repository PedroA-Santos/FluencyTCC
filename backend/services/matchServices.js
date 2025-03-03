const db = require("../db");

exports.buscarMatches = async (userId) => {
    //buscar idiomas nativos e idiomas que o usuário QUER APRENDER!!!
    const [userData] = await db.query(`
            SELECT idioma_nativo_id FROM usuarios WHERE id = ?
        `, [userId]);
        
    const [idiomasAprendidos] = await db.query(
        `SELECT idioma_id FROM usuarios_idiomas WHERE usuario_id = ?`,
        [userId]
    );

    if (!userData || idiomasAprendidos.length === 0) {
        return [];
    }

    const idiomaNativo = userData.idioma_nativo_id;
    const idiomasQuerAprender = idiomasAprendidos.map(row => row.idioma_id);

    // busca usuarios que falam o idiomas desejado ou querem aprender o mesmo idioma
    const [matches] = await db.query(`
        SELECT u.id, u.username, u.bio, u.foto_perfil, ui.idioma_id, ui.nivel
        FROM usuarios u
        JOIN usuarios_idiomas ui ON u.id = ui.usuario_id
        WHERE
            (ui.idioma_id IN (?) AND ui.nivel = 'Avançado' AND u.id != ?)
            OR
            (u.idioma_nativo_id IN (?) AND u.id != ?)
    `, [idiomasQuerAprender, userId, idiomaNativo, userId]);

    return matches;
}