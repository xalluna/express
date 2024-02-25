import { Request, Response } from "express";
import moment from "moment";

export function logger(req: Request, res: Response, next: () => void) {
  const requestTime = moment().format();
  console.log(`[${requestTime}] ${req.method} ${req.path}`);
  try {
    next();
  } catch (e) {
    console.error(e);
  }
}
