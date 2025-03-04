const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), "seuSegredoSuperSecreto");
        req.user = decoded; // Adiciona os dados do usuário autenticado na requisição
        next(); // Permite que a requisição continue
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
