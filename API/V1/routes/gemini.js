const routes = require("express").Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const { getText, textGenerator } = require("../controllers/geminicontrollers");

routes.post("/", verifyTokenMiddleware, getText);// מסלול POST לקבלת טקסט

routes.get("/", verifyTokenMiddleware, textGenerator);// מסלול GET ליצירת טקסט חדש

module.exports = routes;
