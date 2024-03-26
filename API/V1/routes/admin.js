const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

const {
  getAll,
  getUserDetails,
  getText,
  getUser,
  addAdmin,
  shortUrl,
  getQR,
}=require("../controllers/admin");

routes.get("/", verifyTokenMiddleware, getAll);

routes.get("/usadmin", verifyTokenMiddleware, getUserDetails);

routes.get("/textAdmin", getText);

routes.get("/userAdmin", getUser);

routes.get("/addAdmin", addAdmin);

routes.get("/shorturls",shortUrl);

routes.get("/qrcodeAdmin", getQR);

module.exports = routes;
