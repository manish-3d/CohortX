const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

function safeUser(user) {
  if (!user) {
    return null;
  }

  const { password, ...rest } = user;
  return rest;
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(safeUser(user));
  } catch (err) {
    res.status(500).json({
      message: err.message,
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

exports.me = async (req, res) => {
  try {
    if (req.user) {
      return res.json(safeUser(req.user));
    }

    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        process.env.SESSION_SECRET ||
        "cohortx-dev-jwt-secret"
    );

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    return res.json(safeUser(user));
  } catch {
    return res.status(401).json({
      message: "Not authenticated",
    });
  }
};
