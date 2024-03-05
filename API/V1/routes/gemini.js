const routes = require("express").Router();
const { getText, textGenerator } = require("../controllers/geminicontrollers");
routes.post("/", getText);
routes.get("/", textGenerator);

module.exports = routes;
