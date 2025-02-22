const jwt = require('jsonwebtoken');

const segredo = 'minhaChaveSecreta123'; // Deve ser a mesma chave usada para criar o token
const tokenRecebido = 'COLE_AQUI_O_TOKEN_GERADO';

try {
    const decoded = jwt.verify(tokenRecebido, segredo);
    console.log('Token válido! Decodificado:', decoded);
} catch (error) {
    console.log('Token inválido ou expirado:', error.message);
}
