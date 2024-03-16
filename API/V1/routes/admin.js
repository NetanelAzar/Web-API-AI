const routes = require('express').Router();
const verifyTokenMiddleware = require("../middlewares/verifyTokenMiddleware");
const User = require("../models/user"); // מקשר למודל של משתמש
const Text = require("../models/text"); // מקשר למודל של טקסט
const Url = require("../models/urlModel"); // מקשר למודל של כתובות URL


routes.get("/", verifyTokenMiddleware, async (req, res) => {
  try {
    const text = await Text.find().lean(); // מקבל את כל הטקסטים
    const url = await Url.find().lean(); // מקבל את כל הכתובות ה-URL
    const users = await User.find().lean(); // מקבל את כל המשתמשים
    return res.status(200).render("admin", { layout: "index", title: "admin", users, text, url });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

routes.get("/textAdmin", async (req, res) => {
  try {
    const text = await Text.find().lean(); // מקבל את כל הטקסטים
    return res.status(200).render("textAdmin", { layout: "index", title: "admin", text });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

// מסלול יצירת קשר
routes.get("/userAdmin", async (req, res) => {
  const users = await User.find().lean(); // מקבל את כל המשתמשים
  return res.status(200).render("usersAdmin", { layout: "index", title: "admin", users });
});

routes.get("/addAdmin", async (req, res) => {
  const users = await User.find().lean(); // מקבל את כל המשתמשים
  return res.status(200).render("addAdmin", { layout: "index", title: "admin", users });
});

routes.get("/shorturls", async (req, res) => {
  try {
    const urls = await Url.find().lean(); // מקבל את כל הכתובות ה-URL
    return res.status(200).render("shorturls", { layout: "index", title: "admin", urls });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = routes;
