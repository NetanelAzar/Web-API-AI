const routes = require("express").Router();
const { login } = require("../controllers/user");


// מסלול התחברות משתמש
routes.get("/",  (req, res) => { 
  // מסלול הצגת טופס התחברות
  return res.status(200).render("login", { layout: "main", title: "Login"}); // הצגת דף ההתחברות
}).post("/", login); // מסלול פעולת ההתחברות

module.exports = routes; // ייצוא המסלולים

routes.get("/logout", (req, res) => {
  req.session.destroy((err) => {// נקיה של הנתונים המזוהים עם המשתמש המחובר מהמאפיין `req.session`.
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }
    // הפניה אל דף ההתחברות (login page) או דף אחר בו המשתמש יכול להתחבר מחדש.
    res.redirect("/login"); // דוגמה לפנייה אל דף ההתחברות
  });
});



module.exports = routes; // ייצוא המסלולים


