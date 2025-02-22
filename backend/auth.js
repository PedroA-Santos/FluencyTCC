const jwt = require('jsonwebtoken');

const segredo = 'DJH-PED-TCC'; // Nunca exponha isso publicamente!

// Criando o token (expira em 1h)
const token = jwt.sign(payload, segredo, { expiresIn: '1h' });

console.log('Token gerado:', token);
