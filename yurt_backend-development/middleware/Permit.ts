import { NextFunction, Response } from 'express';
import { IRequestWithUser } from '../types/user';

const permit = (roles: string[]) => {
  return (req: IRequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).send({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).send({ error: 'Not authorized' });
    return next();
  };
};

export default permit;
