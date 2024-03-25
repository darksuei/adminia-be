import { ErrorRequestHandler, Request, Response, NextFunction, Errback } from "express";

export const ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const errStatus = 404;

  return res.status(errStatus).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};
