const { Router } = require("express");
const router = Router();
const usuarioIdiomasController = require("../controller/usuarioIdiomasController");


router.get("/", usuarioIdiomasController.listAll);

router.get("/:id", usuarioIdiomasController.listById);

router.post("/", usuarioIdiomasController.postUsuarioIdioma);

router.put("/:id", usuarioIdiomasController.putUsuarioIdioma);

router.delete("/:id", usuarioIdiomasController.deleteUsuarioIdioma);

router.post("/:id/idiomas", usuarioIdiomasController.salvarIdiomas);



module.exports = router;



