import express from 'express';
import "dotenv-defaults/config";
import jwt from 'jsonwebtoken';
import {UserToken, isUserToken} from './user_token';

const SECRET_KEY = process.env.SECRET_KEY ?? '';
const DEFAULT_EXPIRE_SECONDS = 86400;

export function hasAuth(headers: unknown): headers is {authorization: string} {
  return (headers as {authorization: string}).authorization !== undefined;
}

export function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction){
  if(!hasAuth(req.headers)) {
    res.status(401).json({error: 'no authorization token'});
    return;
  }
  try {
    const token = req.headers.authorization;
    const jwtPayload = readToken(token);
    if(!isUserToken(jwtPayload)) {
      throw new Error('invalid token content');
    }
    (req as unknown as {user: UserToken}).user = jwtPayload;
  } catch(err: unknown) {
    res.status(401).json({error: 'invalid token'});
    return;
  }
  next();
}

export function readToken(token: string): unknown {
  if(!token.startsWith('Bearer ')) {
    throw new Error('invalid token format');
  }
  token = token.slice(7);
  return jwt.verify(token, SECRET_KEY);
}

export function generateToken(payload: UserToken, expireSeconds: number = DEFAULT_EXPIRE_SECONDS): string {
  const token = `Bearer ${jwt.sign(payload, SECRET_KEY, {expiresIn: expireSeconds})}`;
  return token;
}
