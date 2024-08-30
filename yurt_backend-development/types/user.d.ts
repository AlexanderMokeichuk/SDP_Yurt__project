import { JwtPayload } from 'jsonwebtoken';
import { HydratedDocument, Model } from 'mongoose';
import { Request } from 'express';

export interface IRequestWithUser extends Request {
  user?: HydratedDocument<IUserFromDb>;
}

export interface IUserFields {
  username: string;
  password: string;
  phoneNumber: string;
  role: string;
  image: string | null;
  blocked: boolean;
}

export interface IUserFromDb extends Omit<IUserFields, 'password'> {
  _id: ObjectId;
}

export interface IDecodedJwt extends JwtPayload {
  user?: string;
}

export interface IUserMethods {
  checkPassword(password: string): Promise<boolean>;
}

export type IUserModel = Model<IUserFields, object, IUserMethods>;
