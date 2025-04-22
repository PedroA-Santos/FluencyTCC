const jwt = require("jsonwebtoken");
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;


module.exports = (req, res, next) => {
    const token = req.headers['authorization']; // <-- aqui

    if (!token) {
        return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado." });
    }
};
