// 1- calling the model
const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const secretKey = "ZhQrZ951";


const allUsers = (req, res) => {
  User.find()
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });
};

const oneUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.find({ _id: id });
  console.log(user);
  res.json(user);
};



const newUser = async (req, res) => {

  const { firstName, email, password } = req.body;
  const token = jwt.sign(
    { email: email, password: password },
    secretKey,
    { expiresIn: "1h" }
  ); // Generate JWT
  console.log(token)
  const hashPassword = await bcrypt.hash(password, 5)
  const user = new User({ firstName: firstName, email: email, password: hashPassword });
  const addUser = await user.save();
  res.json([addUser, token]);
};


const newUserLogin = async (req, res) => {

  const { email, password } = req.body;
  const user = await User.find({ email: email });
  // password check
  const validpassword = await bcrypt.compare(
    password,
    user[0].password
  );
  if (!validpassword) {
    return res.json({ error: "incorrect password" });
  }
  if (validpassword) {
    res.json(user);
  }
};


const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;
  updatedUserData.password = await bcrypt.hash(updatedUserData.password, 5)
  const user = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
  const updatedUser = await user.save();
  res.json(updatedUser);
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  await User.findByIdAndDelete(userId);
  res.status(204).json(User);
};

module.exports = {
  allUsers,
  newUser,
  oneUser,
  updateUser,
  deleteUser,
  newUserLogin,
}; 