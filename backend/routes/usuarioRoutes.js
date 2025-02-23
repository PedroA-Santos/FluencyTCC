const { Router } = require("express");
const router = Router();
const usuarioController = require("../controller/usuarioController");


router.get("/", usuarioController.listAll);

router.get("/:id", usuarioController.listById);

router.post("/", usuarioController.postUsuario);

router.put("/:id", usuarioController.putUsuario);

router.delete("/:id", usuarioController.deleteUsuario);

//router.post("/login", usuarioController.login); // AINDA NÃO ESTÁ FEITO NO CONTROLLER


module.exports = router;



