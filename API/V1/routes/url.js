
const routes =require('express').Router();
const {

getUrl,
addShorten,
getShortUrl
} = require('../controllers/shorturl');



routes.get('/url', getUrl);

routes.post('/shorten', addShorten);

routes.get('/:shortUrl', getShortUrl);


module.exports = routes;
