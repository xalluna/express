import { Request, Response } from "express";
import { Env } from "../env";
import { protectedRoutes, routes } from "../routes";

export class Auth {
  public static middleware(req: Request, res: Response, next: () => void) {
    const userIsAuthenticated = Boolean(req.cookies[Env.cookieName]);

    const isProtectedRoute = protectedRoutes.includes(req.path);

    if (!userIsAuthenticated && isProtectedRoute) {
      res.redirect(routes.login);
      return;
    }

    if (req.path === routes.login && userIsAuthenticated) {
      res.redirect(routes.home);
      return;
    }

    next();
  }
}
