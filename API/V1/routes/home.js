const routes = require("express").Router();


// מסלול הבית
routes.get("/", (req, res) => {
    return res.status(200).render("home", { layout: "main", title: "Home" });
  });

  module.exports = routes;