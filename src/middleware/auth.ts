//const jwt = require("jsonwebtoken");

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface Verified {
  user: string;
  admin: boolean;
}

function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ errorMessage: "Unauthorized" });
    }

    const verified = <Verified>jwt.verify(token, process.env.JWT!);

    req.user = (verified as any).user;
    req.admin = (verified as any).admin;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;

export default auth;
