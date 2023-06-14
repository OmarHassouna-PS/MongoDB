const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/500");

const createToken = (req, res) => {
  const accessToken = jwt.sign(
    JSON.parse(JSON.stringify(req.body)),
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1w" }
  );
  res.json(accessToken)
}

const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user || !(await bcrypt.compare(password, user.password))) {

      res.status(401).send("incorrect email or password");
    }
  } catch (error) {
    errorHandler(error, req, res);
  }

  req.body = user;
  next();
};

const SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  User.find()
    .then((data) => {
      data.map((user) => {
        if (user.email === email) return res.json("Email already taken.");
      });
    })
    .catch((error) => {
      errorHandler(error, req, res);
    });

  const hashedPwd = await bcrypt.hash(password, 10);
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPwd,
  });

  const user = await newUser.save();

  req.body = user;
  next();
};

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
  Login,
  SignUp,
  createToken,
}; 