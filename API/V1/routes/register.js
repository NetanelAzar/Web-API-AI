const routes = require("express").Router();
const upload=require("../middlewares/upload");
const { register } = require("../controllers/user");
routes.get("/", (req, res) => {
    return res
      .status(200)
      .render("register", { layout: "main", title: "Register" });
  }).post("/", upload.single('picture'),register);
  


module.exports = routes;

