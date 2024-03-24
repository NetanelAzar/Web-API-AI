const routes = require("express").Router();
const {
news
}= require("../controllers/news");
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");

routes.get("/",verifyTokenMiddleware ,news);// מסלול הבית

module.exports = routes; // ייצוא המודול
