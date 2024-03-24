const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

const{
getQRCode,
getQRCodePost
}=require("../controllers/qecode");

routes.get("/", verifyTokenMiddleware,getQRCode);// מסלול GET עבור הדף ה־QR Code

routes.post("/generate-qr", verifyTokenMiddleware,getQRCodePost);// מסלול POST ליצירת קוד QR ושמירתו במסד הנתונים

module.exports = routes;