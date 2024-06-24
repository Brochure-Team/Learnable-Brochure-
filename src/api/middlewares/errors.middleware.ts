import { Request, Response, NextFunction } from "express";
import { logger, sendResponse } from "../utils";
import { AppError } from "../services/error.service";

export default (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `${error.name}: ${error.message}`
  const statusCode = error?.statusCode || 500
  
  logger.error('heres your error:', error);
  return sendResponse(res, statusCode, false, message);
};