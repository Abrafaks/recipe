import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { User, UserDocument } from "../models/user.model";

const salt = 10;

export class UserService {
  public setCookie(res: Response, token: string): Response {
    return res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  }

  public unsetCookie(res: Response): Response {
    return res
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .send();
  }

  // user will be null if there isn't
  // that email in db => account can be registered
  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  public async hashPassword(password: string, salt: number): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  public async createUser(
    email: string,
    passwordHash: string
  ): Promise<UserDocument> {
    const user = new User({ email, passwordHash });

    return user.save();
  }

  public createToken(userId: string, isAdmin: boolean): string {
    return jwt.sign(
      {
        userId,
        isAdmin,
      },
      process.env.JWT!
    );
  }

  public async createUserAndReturnToken(
    email: string,
    password: string
  ): Promise<string> {
    const passwordHash = await this.hashPassword(password, salt);
    const savedUser = await this.createUser(email, passwordHash);
    return this.createToken(savedUser._id, false);
  }

  public async arePasswordsMatching(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default new UserService();
