import jwt from "jsonwebtoken";
import Constant from "../common/constant.js";

export const verifyToken = (req, res, next) => {
  if (
    req.url.toLowerCase().trim() === "/login".toLowerCase().trim() ||
    req.url.toLowerCase().trim() === "/register".toLowerCase().trim()
  ) {
    next();
    return;
  }
  const token = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken;
  if (token) {
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        res.status(Constant.HttpStatusCode.FORBIDDEN).json("Token is not valid!");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(Constant.HttpStatusCode.UNAUTHORIZED).json("You're not authenticated");
  }
};

export const verifyTokenAndUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === "admin") {
      next();
    } else {
      res.status(Constant.HttpStatusCode.FORBIDDEN).json("You're not allowed to do that!");
    }
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(Constant.HttpStatusCode.FORBIDDEN).json("You're not allowed to do that!");
    }
  });
};
