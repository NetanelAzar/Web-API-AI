const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const { getUrl, addShorten, getShortUrl } = require('../controllers/shorturl');

// מסלול קבלת כתובת המקוצרת
routes.get('/',verifyTokenMiddleware, getUrl);

// מסלול יצירת קיצור כתובת מקורית
routes.post('/shorten', addShorten);

// מסלול קבלת כתובת מקוצרת לפי הקיצור
routes.get('/:shortUrl', getShortUrl);

module.exports = routes;
