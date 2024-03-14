const routes = require("express").Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const { getText, textGenerator } = require("../controllers/geminicontrollers");
routes.post("/",verifyTokenMiddleware,getText);
routes.get("/", verifyTokenMiddleware,textGenerator);


module.exports = routes;
