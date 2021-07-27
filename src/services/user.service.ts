/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";

export class UserService {
  public async getUsers(): Promise<UserDocument[] | null> {
    return User.find({ isDeleted: false });
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email, isDeleted: false });
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
    const passwordHash = await this.hashPassword(password, 10);
    const savedUser = await this.createUser(email, passwordHash);
    return savedUser;
  }

  public async arePasswordsMatching(
    password: string,
    hash: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public async deleteUser(
    userToDelete: string,
    userId: string,
    isAdmin: boolean
  ): Promise<boolean> {
    let query;
    if (userToDelete) {
      query = { _id: userId };
    }
    if (isAdmin) {
      query = { _id: userToDelete };
    }
    const result = await User.updateOne(
      query,
      { isDeleted: true },
      {
        omitUndefined: true,
      }
    );

    if (result.nModified === 1) {
      return true;
    }
    return true;
  }
}

export default new UserService();
