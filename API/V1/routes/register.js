const routes = require("express").Router();
const { register } = require("../controllers/user");
routes.post("/", register);


module.exports = routes;