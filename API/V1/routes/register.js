const routes = require("express").Router();
const upload = require("../middlewares/upload");
const { register } = require("../controllers/user");

// מסלול הרישום למשתמש חדש
routes.get("/", (req, res) => { // מסלול הצגת טופס הרישום
  return res
    .status(200)
    .render("register", { layout: "main", title: "Register" }); // הצגת דף הרישום
}).post("/", upload.single('picture'), register); // מסלול פעולת הרישום

module.exports = routes; // ייצוא המסלולים
