import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import {
  tokenHandler,
  sendResponse
} from '../utils';
import { userService } from '../services'
import { IUser } from '../interfaces';

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeaders = req.header('Authorization');
    const token = authHeaders && authHeaders.substring(0, 7) === 'Bearer ' ? authHeaders.replace('Bearer ', '') : req.cookies?.token;

    if(!token) return sendResponse(res, 403, false, 'Login to continue')
        
    const decoded = <JwtPayload | string>await tokenHandler.verify(token)
    
    if (decoded === 'expired') return sendResponse(res, 403, false, 'Session expired. Sign in again to continue.')
    if (decoded === 'invalid') return sendResponse(res, 401, false, 'Invalid token.')
      
    const user = await userService.findOne({ _id: (decoded as JwtPayload)._id, deleted: false });
    if (!user) return sendResponse(res, 404, false, 'User not found')

    req.user = user as unknown as IUser;
    console.log('Logged in user:', req.user);
    
    next();
}