const routes = require("express").Router();
const { login } = require("../controllers/user");
routes.post("/", login);


module.exports = routes;
