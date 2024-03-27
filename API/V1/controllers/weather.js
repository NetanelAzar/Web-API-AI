const axios = require("axios");
const jwt = require('jsonwebtoken');
// Function to fetch weather data
async function getWeatherData(city) {
  const apiKey = "53e3ec16cade9f8d29312cbba0329f01";
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${apiKey}`;
  try {
    const response = await axios.get(weatherURL);
    const weatherData = response.data;
    return weatherData;
  } catch (error) {
    console.log("Error fetching weather data:", error);
    throw error;
  }
}
module.exports = {
    getWeather: (req, res) => {
        jwt.verify(req.session.user, process.env.PRIVATE_KEY, async (err, decoded) => {
            const city = req.query.city;
            try {
            if (err) {
                console.error(err);
                return res.status(401).render("home", { layout: "main", title: "HOME" });
            }
            const fullName = decoded.fullName;
            res.render("weatherCity", { layout: "main",username: fullName, profileImage: req.session.profileImage  });
        
        } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
        }
        });
    },
    getWeatherDetails: async (req, res) => {
        // פענוח הטוקן המוצפן ב-session על מנת לקבל את האימייל של המשתמש
        jwt.verify(req.session.user, process.env.PRIVATE_KEY, async (err, decoded) => {
          const city = req.query.city;
          try {
          if (err) {
              console.error(err);
              return res.status(401).render("home", { layout: "main", title: "HOME" });
          }
          const weatherData = await getWeatherData(city);
          const userEmail = decoded.email; // האימייל של המשתמש
          const fullName = decoded.fullName;
         
          res.render("weatherCity", { layout: "main", weather: weatherData, username: fullName, 
          profileImage: req.session.profileImage 
      }); 
      } catch (error) {
      console.error(error);
      return res.status(500).send('Internal server error');
      }
      });
      }
};