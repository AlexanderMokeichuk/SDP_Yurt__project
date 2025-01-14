import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IDecodedJwt, IRequestWithUser } from '../types/user';

const auth = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
  const tokenData = req.get('Authorization');

  if (!tokenData) return res.status(401).send({ error: 'No token provided' });

  const [, token] = tokenData.split(' ');
  let decoded: IDecodedJwt;
  try {
    decoded = jwt.verify(token, `${process.env.JWT_ACCESS}`) as IDecodedJwt;
  } catch (e) {
    return res.status(401).send({ error: 'Unauthorized' });
  }

  const user = await User.findOne({ _id: decoded.user });

  if (!user) return res.status(403).send({ error: 'Wrong token' });
  else if (user.blocked) {
    return res.status(403).send({ error: 'User is blocked!!' });
  }

  req.user = user;
  next();
};

export default auth;
