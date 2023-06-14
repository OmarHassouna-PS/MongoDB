const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyJWT = require("../middleware/verifyJWT")

router.get("/users", userController.allUsers);
router.post("/users", userController.newUser);
router.get("/users/:id", userController.oneUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);
router.post("/login", userController.Login, userController.createToken);
router.post("/signUp", userController.SignUp, userController.createToken);


module.exports = router;