const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.allUsers);
router.post("/users", userController.newUser);
router.post("/usersLogin", userController.newUserLogin);
router.get("/users/:id", userController.oneUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);


module.exports = router;