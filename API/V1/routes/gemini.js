const routes = require("express").Router();
const session = require("../middlewares/authSession");
const { getText, textGenerator } = require("../controllers/geminicontrollers");
routes.post("/", session,getText);
routes.get("/", textGenerator);


module.exports = routes;
