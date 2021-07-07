import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
interface VerifiedToken {
  user: string;
  admin: boolean;
}

function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthorized" });
    }

    const verified = <VerifiedToken>jwt.verify(token, process.env.JWT!);

    req.userId = verified.user;
    req.admin = verified.admin;
    next();
  } catch (err) {
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

export default auth;
