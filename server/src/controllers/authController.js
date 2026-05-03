const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ROLES } = require("../utils/constants");
const { isEmailValid, isNonEmptyString } = require("../utils/validation");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!isNonEmptyString(name) || !isEmailValid(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ message: "Invalid registration details" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  if (role && !Object.values(ROLES).includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const user = await User.create({ name, email, password, role: role || ROLES.CUSTOMER });
  res.status(201).json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!isEmailValid(email) || !isNonEmptyString(password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
