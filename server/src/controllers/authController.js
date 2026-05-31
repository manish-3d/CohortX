const bcrypt = require("bcrypt");
const prisma = require("../config/db");

exports.register = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
    } = req.body;

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.json({
      message: "Logged out",
    });
  });
};

exports.me = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }

  res.json(req.user);
};