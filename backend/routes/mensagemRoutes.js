const { Router } = require("express");
const router = Router();
const mensagemController = require("../controller/mensagemController");


router.get("/", mensagemController.listAll);

router.get("/:id", mensagemController.listById);

router.post("/", mensagemController.postMensagem);

router.put("/:id", mensagemController.putMensagem);

router.delete("/:id", mensagemController.deleteMensagem);



module.exports = router;



