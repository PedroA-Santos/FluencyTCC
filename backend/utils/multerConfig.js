const multer = require('multer');
const path = require('path');

// Definindo o local de armazenamento dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Pasta onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    // Definindo o nome do arquivo (timestamp + extensão original)
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Filtrando os tipos de arquivos permitidos (somente imagens)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB para o tamanho do arquivo
});

// Exportando a configuração para ser usada em outros arquivos
module.exports = upload;
