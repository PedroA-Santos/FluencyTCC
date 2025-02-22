const { Router } = require("express");
const router = Router();
const idiomaController = require("../controller/idiomaController");

router.get("/", idiomaController.listAll);

router.get("/:id", idiomaController.listById);

router.post("/", idiomaController.postIdioma);

router.put("/:id", idiomaController.putIdioma);

router.delete("/:id", idiomaController.deleteIdioma);



module.exports = router;



