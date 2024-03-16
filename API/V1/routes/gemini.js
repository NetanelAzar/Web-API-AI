const routes = require("express").Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const { getText, textGenerator } = require("../controllers/geminicontrollers");

// מסלול POST לקבלת טקסט
routes.post("/", verifyTokenMiddleware, getText);

// מסלול GET ליצירת טקסט חדש
routes.get("/", verifyTokenMiddleware, textGenerator);

module.exports = routes;
