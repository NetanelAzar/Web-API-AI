const routes = require("express").Router();

const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
 
} = require("../controllers/user");


routes.get("/", getAllUsers);// מסלול קבלת כל המשתמשים

routes.get("/:id", getUserById);// מסלול קבלת משתמש על פי זיהוי

routes.post("/", addUser);// מסלול הוספת משתמש חדש

routes.patch("/:id", updateUser);// מסלול עדכון משתמש קיים

routes.delete("/:id", deleteUser);// מסלול מחיקת משתמש על פי זיהוי

module.exports = routes;
