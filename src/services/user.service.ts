/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";

const rounds = 10;

export class UserService {
  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  public async hashPassword(password: string, rounds: number): Promise<string> {
    return bcrypt.hash(password, rounds);
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
  ): Promise<UserDocument> {
    const passwordHash = await this.hashPassword(password, rounds);
    const savedUser = await this.createUser(email, passwordHash);
    return savedUser;
  }

  public async arePasswordsMatching(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

export default new UserService();
