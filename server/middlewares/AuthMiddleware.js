import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).send("You are not authenticated!");
    }

    // ✅ synchronous verification
    const payload = jwt.verify(token, process.env.JWT_KEY);

    req.userId = payload.userId;

    return next(); // ✅ Express stays in control
  } catch (error) {
    return res.status(403).send("Token is not valid!");
  }
};
