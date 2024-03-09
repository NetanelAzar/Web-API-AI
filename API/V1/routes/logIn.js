const routes = require("express").Router();
const { login } = require("../controllers/user");
routes.get("/", (req, res) => {
    return res.status(200).render("login", { layout: "main", title: "Login" });
  }).post("/", login);


module.exports = routes;
