const { Router } = require("express");
const router = Router();
const usuarioInteressesController = require("../controller/usuarioInteressesController");


router.get("/", usuarioInteressesController.listAll);

router.get("/:id", usuarioInteressesController.listById);

router.post("/:usuario_id", usuarioInteressesController.postUsuarioInteresse);


router.put("/:id", usuarioInteressesController.putUsuarioInteresse);

router.delete("/:usuario_id", usuarioInteressesController.deleteUsuarioInteresse);



module.exports = router;



