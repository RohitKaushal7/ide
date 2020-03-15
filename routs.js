const router = require("express").Router();

const controllers = require("./controller");

router.get("/", controllers.getIDE);
router.post("/cpp", controllers.postCpp);
router.post("/python", controllers.postPython);

router.get("/chat", controllers.getChat);

module.exports = router;
