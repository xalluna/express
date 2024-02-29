import { Request, Response } from "express";
import moment from "moment";

export class Logger {
  public static log(message?: string) {
    console.log(`[${moment().format()}] ${message}`);
  }

  public static middleware(req: Request, res: Response, next: () => void) {
    Logger.log(`${req.method} ${req.path}`);

    next();
  }
}
