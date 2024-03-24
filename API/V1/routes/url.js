const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const { getUrl, addShorten, getShortUrl } = require('../controllers/shorturl');

routes.get('/',verifyTokenMiddleware, getUrl);// מסלול קבלת כתובת המקוצרת

routes.post('/shorten', addShorten);// מסלול יצירת קיצור כתובת מקורית

routes.get('/:shortUrl', getShortUrl);// מסלול קבלת כתובת מקוצרת לפי הקיצור

module.exports = routes;
