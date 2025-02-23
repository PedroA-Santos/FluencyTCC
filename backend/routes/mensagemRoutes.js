const { Router } = require("express");
const router = Router();
const mensagemController = require("../controller/mensagemController");


router.get("/mensagens/", mensagemController.listAll);

router.get("/mensagens/:id", mensagemController.listById);

router.post("/:match_id/mensagens", mensagemController.postMensagem);

router.put("/mensagens/:id", mensagemController.putMensagem);

router.delete("/mensagens/:id", mensagemController.deleteMensagem);



module.exports = router;



