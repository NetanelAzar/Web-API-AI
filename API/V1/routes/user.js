const routes = require("express").Router();
const session = require("../middlewares/authSession");
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  register,
  login,
} = require("../controllers/user");

// מסלול קבלת כל המשתמשים
routes.get("/", getAllUsers);

// מסלול קבלת משתמש על פי זיהוי
routes.get("/:id", getUserById);

// מסלול הוספת משתמש חדש
routes.post("/", addUser);

// מסלול עדכון משתמש קיים
routes.patch("/:id", updateUser);

// מסלול מחיקת משתמש על פי זיהוי
routes.delete("/:id", deleteUser);

module.exports = routes;
