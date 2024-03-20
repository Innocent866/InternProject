import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ err: "Invalid authentication" });
    }

    const token = authHeader.split(" ")[1];

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.user.id,
      email: payload.user.email,
      fullname: payload.user.fullname,
      location: payload.user.location,
    };
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ err: "Authentication failed" });
  }
};

export default auth;
