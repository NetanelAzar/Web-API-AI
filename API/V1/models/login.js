const mongoose = require("mongoose");
mongoose.pluralize(null);

const loginSchema = new mongoose.Schema({
    email: String,
    pass: String,
});

// בדוגמה הזו, אנו בודקים אם המודל כבר הוגדר. אם כן, אז נשתמש בו; אם לא, נגדיר אותו.
let UserModel;
try {
    // אם המודל כבר הוגדר, נשתמש בו
    UserModel = mongoose.model("users");
} catch (error) {
    // אם המודל עדיין לא הוגדר, נגדיר אותו
    UserModel = mongoose.model("users", loginSchema);
}

module.exports = UserModel;
