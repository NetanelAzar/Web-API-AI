const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // קבלת פרטי המשתמש (לדוגמה מתוך גוף הבקשה)
    const { email, pass, fullName } = req.body;

    // יצירת טוקן JWT
    const token = jwt.sign({ email, pass, fullName }, process.env.PRIVATE_KEY, {
      expiresIn: "1h",
    });

    // הגדרת הטוקן בסשן
    req.session.user = token;

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Unauthorized" });
  }
};
