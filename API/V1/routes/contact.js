
const routes = require("express").Router();
var nodemailer = require('nodemailer');
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

const {
  getContact,
  sendMailContact
}=require("../controllers/contact");

// מסלול יצירת קשר
routes .get("/",verifyTokenMiddleware,getContact );
  
routes.post('/send-email', sendMailContact);

  module.exports = routes;