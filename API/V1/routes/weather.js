const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const{
    getWeather,
    getWeatherDetails
}=require('../controllers/weather');


routes.get("/",verifyTokenMiddleware,getWeather );

routes.get("/weather-data",getWeatherDetails);

module.exports = routes;
