const { Router } = require("express");
const router = Router();
const usuarioController = require("../controller/usuarioController");


router.get("/", usuarioController.listAll);

router.get("/:id", usuarioController.listById);

router.post("/", usuarioController.postUsuario);

router.put("/:id", usuarioController.putUsuario);

router.delete("/:id", usuarioController.deleteUsuario);

router.post("/login", usuarioController.login);


router.post("/step1", usuarioController.postUsuarioStep1); // ROTA PARA O PASSO 1 DO CADASTRO DE USUÁRIO

router.put("/step2/:id", usuarioController.updateUsuarioStep2); // ROTA PARA O PASSO 2 DO CADASTRO DE USUÁRIO


module.exports = router;




