
const routes = require("express").Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

// מסלול יצירת קשר
routes .get("/",verifyTokenMiddleware,(req,res)=>{
  const fullName = req.user; // משתמש במידע המזוהה עם המשתמש מהמידלוור
    return res.status(200).render("contact", { layout: "main", title: "contact",username: fullName });
    
  } );
  

  module.exports = routes;