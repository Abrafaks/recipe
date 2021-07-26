import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "src/test/config/server.config";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(StatusCodes.BAD_REQUEST).send({
    errors: errors.array(),
  });
};
