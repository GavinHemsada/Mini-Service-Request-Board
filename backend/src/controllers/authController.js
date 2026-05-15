const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../middleware/auth");
const { AppError } = require("../middleware/errors");

async function register(req, res) {
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name: name || "" });
  const token = signToken(user);
  res.status(201).json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    throw new AppError("Invalid email or password", 401);
  }
  const token = signToken(user);
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
}

module.exports = {
  register,
  login,
};
