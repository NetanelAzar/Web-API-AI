const routes = require("express").Router();
const { login } = require("../controllers/user");

// מסלול התחברות משתמש
routes.get("/", (req, res) => { // מסלול הצגת טופס התחברות
  return res.status(200).render("login", { layout: "main", title: "Login" }); // הצגת דף ההתחברות
}).post("/", login); // מסלול פעולת ההתחברות

module.exports = routes; // ייצוא המסלולים
