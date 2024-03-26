const routes = require("express").Router();
const { 
  login,
  logOut,
 } = require("../controllers/user");


// מסלול התחברות משתמש
routes.get("/",  (req, res) => { 
  // מסלול הצגת טופס התחברות
  return res.status(200).render("login", { layout: "main", title: "Login"}); // הצגת דף ההתחברות
}).post("/", login); // מסלול פעולת ההתחברות

routes.get("/logout", logOut);



module.exports = routes; // ייצוא המסלולים


