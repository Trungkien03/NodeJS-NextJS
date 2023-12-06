import { RESPONSE_STATUS_CODE } from '@app/constants/ErrorConstants';
import { IRequest } from '@app/types/UserTypes';
import ErrorClass from '@app/utils/ErrorClass';
import { redis } from '@app/utils/RedisClient';
import dotenv from 'dotenv';
import { NextFunction, Response } from 'express';
import Jwt, { JwtPayload } from 'jsonwebtoken';
import { catchAsyncError } from './CatchAsyncErrors';

dotenv.config();

export const isAuthenticated = catchAsyncError(async (req: IRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken)
    return next(new ErrorClass('Please login to access this resource', RESPONSE_STATUS_CODE.UNAUTHORIZED));

  const decoded = Jwt.verify(accessToken, process.env.ACCESS_TOKEN as string) as JwtPayload;
  if (!decoded) return next(new ErrorClass('Access Token is not valid', RESPONSE_STATUS_CODE.BAD_REQUEST));

  const user = await redis.get(decoded.id);
  if (!user) return next(new ErrorClass('User not found', RESPONSE_STATUS_CODE.BAD_REQUEST));

  req.user = JSON.parse(user);

  next();
});

// validate user Role
export const authorizeRoles = (...roles: string[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new ErrorClass(`Role: ${req.user?.role} is not allowed to access this resource`, RESPONSE_STATUS_CODE.FORBIDDEN)
      );
    }
    next();
  };
};
