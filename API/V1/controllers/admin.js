const User = require("../models/user"); // מקשר למודל של משתמש
const Text = require("../models/text"); // מקשר למודל של טקסט
const Url = require("../models/urlModel"); // מקשר למודל של כתובות URL
const qr = require("../models/qrcode"); // מקשר למודל של כתובות URL
module.exports ={
    getAll: async (req, res) => {
        try {
          const text = await Text.find().lean(); // מקבל את כל הטקסטים
          const url = await Url.find().lean(); // מקבל את כל הכתובות ה-URL
          const users = await User.find().lean(); // מקבל את כל המשתמשים
          const QRcode = await qr.find().lean(); // מקבל את כל הכתובות ה-URL
          const sessionCount = req.sessionCount; // מקבל את מספר המשתמשים המחוברים מהמידלוור
          return res.status(200).render("admin", { layout: "index", title: "admin", users, text, url,sessionCount,QRcode });
        } catch (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
      },
     
      getUserDetails: async (req, res) => {
        try {
            const users = await User.find().lean();
    
            for (const user of users) {
                // מציין את מספר ה-QR codes לכל משתמש
                user.qrCodesCount = await qr.countDocuments({ userEmail: user.email });
                // מציין את מספר ה-URLs לכל משתמש
                user.urlsCount = await Url.countDocuments({ userEmail: user.email });
            }
    
            const sessionCount = req.sessionCount;
    
            // מחזיר את הנתונים לתבנית ה-HTML להצגה
            return res.status(200).render("usadmin", { layout: "index", title: "User Details", users, sessionCount });
        } catch (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }
    },
    
      getText:async (req, res) => {
        try {
          const text = await Text.find().lean(); // מקבל את כל הטקסטים
          return res.status(200).render("textAdmin", { layout: "index", title: "Users Text", text });
        } catch (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
      },

      getUser:async (req, res) => {
        const users = await User.find().lean(); // מקבל את כל המשתמשים
        for (const user of users) {
            // מציין את מספר ה-QR codes לכל משתמש
            user.qrCodesCount = await qr.countDocuments({ userEmail: user.email });
            // מציין את מספר ה-URLs לכל משתמש
            user.urlsCount = await Url.countDocuments({ userEmail: user.email });
        }

        const sessionCount = req.sessionCount;
        return res.status(200).render("usersAdmin", { layout: "index", title: "Users", users,sessionCount });
      },


      addAdmin:async (req, res) => {
        const users = await User.find().lean(); // מקבל את כל המשתמשים
        return res.status(200).render("addAdmin", { layout: "index", title: "Add User And Admin", users });
      },

      shortUrl: async (req, res) => {
        try {
          const urls = await Url.find().lean(); // מקבל את כל הכתובות ה-URL
          return res.status(200).render("shorturls", { layout: "index", title: "URL", urls });
        } catch (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
      },

      getQR:async (req, res) => {
        const QRcode = await qr.find().lean(); // מקבל את כל הכתובות ה-URL
        return res.status(200).render("qrcodeAdmin", { layout: "index", title: "QR", QRcode });
      }
}