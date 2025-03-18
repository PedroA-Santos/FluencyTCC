const multer = require('multer');
const path = require('path');

// Configuração do multer para armazenar imagens no servidor
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);  // Extrai a extensão do arquivo
        const filename = `${Date.now()}-${file.fieldname}${ext}`;  // Nome único para o arquivo
        cb(null, filename);
    }
});

// Aceitar apenas arquivos de imagem
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Somente imagens são permitidas'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
