import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export const decriptJwt = (req: Request, res: Response, next: NextFunction) => {

  const token = req.headers.authorization;

  try {
    const encryption = process.env.JWT_ENCRYPTION;
    if (!token || !encryption) { throw Error}
    res.locals.jwt = jwt.verify(token.split(' ')[1], encryption);
  } catch (e) {
    return res.status(401).json({
      message: 'UNAUTHORIZED',
      status: 401
    });
  }
  next();
}