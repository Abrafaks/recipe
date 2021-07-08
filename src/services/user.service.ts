import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { User } from "../models/user.model";

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
  // this email in db => account can be registered
  public async getUserByEmail(email: string): Promise<User | null> {
    return await User.findOne({ email });
  }

  public async hashPassword(password: string, salt: number): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public async createUser(email: string, passwordHash: string): Promise<User> {
    const user = new User({ email, passwordHash });

    return await user.save();
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
    const passwordHash = await this.hashPassword(password, 10);
    const savedUser = await this.createUser(email, passwordHash);
    return this.createToken(savedUser._id, false);
  }

  public async arePasswordsMatching(
    password: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export default new UserService();
