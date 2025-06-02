const { Router } = require("express");
const router = Router();
const usuarioController = require("../controller/usuarioController");
const authMiddleware = require("../middleware/authMiddleware");

// Importando a configuração do multer
const upload = require('../utils/multerConfig');

// Definindo as rotas de API

router.get("/", usuarioController.listAll);

router.get("/:id", usuarioController.listById);

router.post("/", usuarioController.postUsuario);

router.put("/:id", usuarioController.putUsuario);

router.delete("/:id", usuarioController.deleteUsuario);

router.post("/login", usuarioController.login);

//router.get("/me", authMiddleware, usuarioController.getUsuarioLogado)

router.post("/step1", usuarioController.postUsuarioStep1);

// Rota para atualizar o perfil (incluindo foto de perfil)
router.put("/step2/:id", upload.single('foto_perfil'), usuarioController.updateUsuarioStep2);

router.get('/:id/idiomas/verificar', usuarioController.verificarIdiomasSelecionados);

module.exports = router;
