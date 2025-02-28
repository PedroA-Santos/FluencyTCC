const { Router } = require("express");
const router = Router();
const generoController = require("../controller/generoController");

router.get("/", generoController.listAll);

router.get("/:id", generoController.listFindById);

router.post("/", generoController.post);

router.put("/:id", generoController.put);

router.delete("/:id", generoController.delete);

module.exports = router;        