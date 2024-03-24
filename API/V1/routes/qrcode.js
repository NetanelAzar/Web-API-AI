const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

const{
getQRCode,
getQRCodePost
}=require("../controllers/qecode");


// מסלול GET עבור הדף ה־QR Code
routes.get("/", verifyTokenMiddleware,getQRCode);

// מסלול POST ליצירת קוד QR ושמירתו במסד הנתונים
routes.post("/generate-qr", verifyTokenMiddleware,getQRCodePost);

module.exports = routes;