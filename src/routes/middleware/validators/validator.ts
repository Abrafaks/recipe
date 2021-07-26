import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  console.log(req);
  return res.status(400).send({
    errors: errors.array(),
  });
};
