const routes = require("express").Router();
const {
news
}= require("../controllers/news");
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
// מסלול הבית
routes.get("/",verifyTokenMiddleware ,news);

module.exports = routes; // ייצוא המודול
