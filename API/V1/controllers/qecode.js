
const qr = require('qrcode');
const QRCode = require("../models/qrcode");
const jwt = require('jsonwebtoken');

module.exports ={
    getQRCode: async (req, res) => {
        try {
            // פענוח ה-token המוצפן ב-session
            jwt.verify(req.session.user, process.env.PRIVATE_KEY, async (err, decoded) => {
                if (err) {
                    console.error(err);
                    return res.status(401).render("home", { layout: "main", title: "home" });
                }
    
                // האימייל של המשתמש מה-token
                const userEmail = decoded.email;
                const fullName = decoded.fullName;
    
                // מציאת כל ה-QR Codes שנוצרו על ידי המשתמש המחובר
                const userQRCodes = await QRCode.find({ userEmail: userEmail }).lean();
    
                // הצגת הנתונים בעמוד HTML
                res.render("qrcode", {
                    layout: "main",
                    title: "QRCode",
                    username: fullName,
                    profileImage: req.session.profileImage,
                    qrCodes: userQRCodes
                });
            });
        } catch (error) {
            console.error("Failed to retrieve QR codes:", error);
            res.status(500).json({ error: "Failed to retrieve QR codes" });
        }
    },
    
    getQRCodePost: async (req, res) => {
        const { githubLink } = req.body;
      
        if (!githubLink) {
          return res.status(400).json({ error: "GitHub Link is required" });
        }
      
        try {
          // וודאות ה-token
          jwt.verify(req.session.user, process.env.PRIVATE_KEY, async (err, decoded) => {
            if (err) {
              console.error(err);
              return res.status(401).send("Failed to verify user token.");
            }
            
            // אם הוודאות הצליחה, ניקח את האימייל של המשתמש מה-token
            const userEmail = decoded.email;
    
            // יצירת קוד QR
            const qrCode = await qr.toDataURL(githubLink);
    
            // שמירת הנתונים במסד הנתונים
            const qrData = new QRCode({
              githubLink: githubLink,
              qrCode: qrCode,
              userEmail: userEmail,
            });
      
            await qrData.save();
      
            res.json({ qrCode });
          });
        } catch (error) {
          console.error("Failed to generate and save QR code:", error);
          res.status(500).json({ error: "Failed to generate and save QR code" });
        }
    },
    
}


