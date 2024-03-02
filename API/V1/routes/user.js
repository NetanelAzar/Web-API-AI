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

routes.get("/", session, getAllUsers);
routes.get("/:id", getUserById);
routes.post("/", addUser);
routes.patch("/:id", updateUser);
routes.delete("/:id", deleteUser);
routes.post("/register", register);
routes.post("/login", login);

module.exports = routes;
