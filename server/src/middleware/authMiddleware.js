const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

exports.isAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Unauthorized",
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
        message: "Unauthorized",
      });
    }

    req.user = user;

    return next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};
