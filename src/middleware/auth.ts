import { Request, Response } from "express";
import { Env } from "../env";
import { protectedRoutes, routes } from "../routes";

//- T5-REF4: Auth middleware will prevent access to any page other than login or register when missing user cookie.

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
