const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware function for token verification
const verifyTokenMiddleware = (req, res, next) => {
    // פענוח הטוקן המוצפן ב-session על מנת לקבל את שם המשתמש
    jwt.verify(req.session.user, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) {
            
            return res.status(401).render("Entrance", { layout: "main", title: "Entrance" });
        } else {
            // אם הפענוח הצליח, מידע המזוהה עם המשתמש מוצג בתבנית התצוגה "shorturls"
            const fullName = decoded.fullName;
            req.user = fullName; // הוספת המשתמש לאובייקט הבקשה לשימוש בקוד הבא

            // שליפת התמונה מהבסיס נתונים
            User.findOne({ email: decoded.email }).then((user) => {
                // שמירת כתובת התמונה בסשן
                req.session.profileImage = `/uploads/pics/${user.picname}`;
                // קבלת מספר המשתמשים המחוברים
                const store = req.sessionStore;
                store.all((error, sessions) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).send('Server Error');
                    }
                    req.sessionCount = sessions.length; // הוספת מספר המשתמשים המחוברים לאובייקט הבקשה

                    // המשך לפונקציה הבאה בשרשרת
                    next();
                });
            }).catch((error) => {
                console.error("Error fetching user data:", error);
                return res.status(500).render("InternalError", { layout: "main", title: "Internal Server Error" });
            });
        }
    });
};

module.exports = verifyTokenMiddleware;
