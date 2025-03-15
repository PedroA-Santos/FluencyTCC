const { Router } = require("express");
const router = Router();
const matchController = require("../controller/matchController");
const authMiddleware = require("../middleware/authMiddleware"); //arquivo para autenticar user, provisório

//rota protegida: retorna os matches do usuario autenticado
router.get("/contatos/:userId", /*authMiddleware,*/ matchController.getUserMatches);

router.get("/", matchController.listAll);

router.get("/:id", matchController.listById);

router.get("/sugeridos/:userId", authMiddleware, matchController.obterMatches)

router.post("/", matchController.postMatch);

router.put("/:id", matchController.putMatch);

router.delete("/:id", matchController.deleteMatch);



module.exports = router;



