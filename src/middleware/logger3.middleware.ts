import { NextFunction, Request, Response } from 'express';

export function logger3(req: Request, res: Response, next: NextFunction) {
  console.log('Third logger');
  next();
}
