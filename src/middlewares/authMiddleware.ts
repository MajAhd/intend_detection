import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const userAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const accessToken = req.headers['authorization'];
  const { JWT_SECRET } = process.env;

  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(accessToken, JWT_SECRET || 'secret', (err, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid token', err });
    }
    if (typeof decoded !== 'object' || decoded === null || !decoded?.uid) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    req.query.uid = decoded?.uid;
    return next();
  });
};
