import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils';
import { IUser, InternInterface } from '../interfaces/profile.interface';
import { IGroup, ITaskSubmission } from '../interfaces';

export function allowCoordinator(
  req: Request,
  res: Response,
  next: NextFunction
) {
    if (req.user.role !== 'coordinator') {
      return sendResponse(res, 403, false, 'You are not allowed to perform this action')
    }

    next();
}

export function allowMentor(
  req: Request,
  res: Response,
  next: NextFunction
) {
    if (req.user.role !== 'mentor') {
      return sendResponse(res, 403, false, 'You are not allowed to perform this action')
    }

    next();
}

export function allowIntern(
  req: Request,
  res: Response,
  next: NextFunction
) {
    if (req.user.role !== 'intern') {
      return sendResponse(res, 403, false, 'You are not allowed to perform this action')
    }

    next();
}

export function allowFacilitator(req: Request,
  res: Response,
  next: NextFunction) {
    if (req.user.role === 'mentor' && req.user.permissions && req.user.permissions.includes('facilitate')) {
      next();
    } else {
        return sendResponse(res, 403, false, 'You are not allowed to perform this action')
    }
}

export function allowCoordinatorAndFacilitator(req: Request,
  res: Response,
  next: NextFunction) {
    if (req.user.role === 'mentor' && req.user.permissions && req.user.permissions.includes('facilitate') || req.user.role === 'coordinator') {
      next();
    } else {
        return sendResponse(res, 403, false, 'You are not allowed to perform this action')
    }
}

export function allowMarker(req: Request,
  res: Response,
  next: NextFunction) {
    if (req.user.role === 'mentor' && req.user.permissions && req.user.permissions.includes('mark')) {
      next();
    } else {
        return sendResponse(res, 403, false, 'You are not allowed to perform this action')
    }
}

export const isSubmissionOwnerOrGroupMember = (submission: ITaskSubmission, user: IUser) => (submission.interns as InternInterface[]).filter(intern => user._id.toString() === intern._id.toString())