import { Request, Response } from "express";
import moment from "moment";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: () => void
) {
  const requestTime = moment().format();
  console.error(`[${requestTime}] ${req.method} ${err.message}`);
  res.status(500).send(err.message);

  next();
}
