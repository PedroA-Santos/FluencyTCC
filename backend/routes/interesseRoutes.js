const { Router } = require("express");
const router = Router();
const interesseController = require("../controller/interesseController");


router.get("/", interesseController.listAll);

router.get("/:id", interesseController.listById);

router.post("/", interesseController.postInteresse);

router.put("/:id", interesseController.putInteresse);

router.delete("/:id", interesseController.deleteInteresse);



module.exports = router;



