
const routes = require("express").Router();
var nodemailer = require('nodemailer');
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

const {
  getContact,
  sendMailContact
}=require("../controllers/contact");


routes .get("/",verifyTokenMiddleware,getContact );// מסלול יצירת קשר
  
routes.post('/send-email', sendMailContact);// מסלול לשליחת הודעה 

  module.exports = routes;