import { Request, Response } from "express";
import moment from "moment";

export function log(message?: string) {
  console.log(`[${moment().format()}] ${message}`);
}

export function logger(req: Request, res: Response, next: () => void) {
  log(`${req.method} ${req.path}`);

  try {
    next();
  } catch (e) {
    console.error(e);
  }
}
