/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "../models/user.model";

interface Query {
  _id: string;
}
export class UserService {
  public async getUsers(): Promise<UserDocument[] | null> {
    return User.find({ isDeleted: false });
  }

  public async getUserByEmail(email: string): Promise<UserDocument | null> {
    return User.findOne({ email });
  }

  public async getCurrentUser(userId: string): Promise<UserDocument | null> {
    return User.findById(userId);
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

  public async createNewUser(
    email: string,
    password: string
  ): Promise<UserDocument> {
    const passwordHash = await this.hashPassword(password, 10);
    return await this.createUser(email, passwordHash);
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
    let query: Query = { _id: "" };

    if (isAdmin) {
      query = { _id: userToDelete };
    } else {
      if (userToDelete === userId) {
        query = { _id: userId };
      }
    }

    const result = await User.updateOne(
      query,
      { isDeleted: true, email: query!._id },
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
