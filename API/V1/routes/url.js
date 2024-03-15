const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const {
    getUrl,
    addShorten,
    getShortUrl
} = require('../controllers/shorturl');

routes.get('/', verifyTokenMiddleware,getUrl);
routes.post('/shorten', addShorten);
routes.get('/:shortUrl', getShortUrl);

module.exports = routes;
