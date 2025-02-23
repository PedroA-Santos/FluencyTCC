const { Router } = require("express");
const router = Router();
const usuarioInteressesController = require("../controller/usuarioInteressesController");


router.get("/", usuarioInteressesController.listAll);

router.get("/:id", usuarioInteressesController.listById);

router.post("/", usuarioInteressesController.postUsuarioInteresse);

router.put("/:id", usuarioInteressesController.putUsuarioInteresse);

router.delete("/:id", usuarioInteressesController.deleteUsuarioInteresse);



module.exports = router;



