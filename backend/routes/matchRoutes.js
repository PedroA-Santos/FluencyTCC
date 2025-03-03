const { Router } = require("express");
const router = Router();
const matchController = require("../controller/matchController");


router.get("/", matchController.listAll);

router.get("/:id", matchController.listById);

router.get("/matches/:userId", matchController.obterMatches)

router.post("/", matchController.postMatch);

router.put("/:id", matchController.putMatch);

router.delete("/:id", matchController.deleteMatch);



module.exports = router;



