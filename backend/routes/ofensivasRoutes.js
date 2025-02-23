const { Router } = require("express");
const router = Router();
const ofensivasController = require("../controller/ofensivasController");


router.get("/", ofensivasController.listAll);

router.get("/:id", ofensivasController.listById);

router.post("/", ofensivasController.postOfensivas);

router.put("/:id", ofensivasController.putOfensivas);

router.delete("/:id", ofensivasController.deleteOfensivas);



module.exports = router;



