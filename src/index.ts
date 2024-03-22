import express, { Express, Request, Response } from "express";
import { Logger } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { Env } from "./env";
import { CookieAge } from "./common/cookie-age";
import { Auth } from "./middleware/auth";
import { routes } from "./routes";
import { UsersService } from "./users/users-service";
import { pages } from "./pages";
import { UserCookie } from "./common/cookie";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import moment from "moment";

//#region Init/Middleware
const app: Express = express();
const port = Env.port || 3000;
app.set("view engine", "pug");
app.set("views", "./src/pages");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(Logger.middleware);
app.use(Auth.middleware);
//#endregion

//#region Get Routes
app.get(routes.home, (req: Request, res: Response) => {
  const userService = new UsersService(req, res);
  const user = userService.getUser();
  const expiration = req.cookies[Env.cookieName].expiration;

  const message = `Welcome ${
    user?.username
  }! Your session will expire at ${moment(expiration).format(
    "MMMM Do YYYY, h:mm:ss a"
  )}`;

  res.status(200);
  res.render(pages.home, { title: "Home", message });
});

app.get(routes.login, (_: Request, res: Response) => {
  res.status(200);
  res.render(pages.login);
});

app.get(routes.register, (_: Request, res: Response) => {
  res.status(200);
  res.render(pages.register);
});

app.get(routes.logOut, (_: Request, res: Response) => {
  res.status(200);
  res.render(pages.logOut);
});

app.get(routes.cookie, (req: Request, res: Response) => {
  const cookieKeys = Object.keys(req.cookies);

  const cookies = cookieKeys.map((key) => {
    return `${key}: ${JSON.stringify(req.cookies[key])}`;
  });

  res.status(200);
  res.render(pages.cookie, { cookies });
});
//#endregion

//#region Post Routes
app.post(routes.login, async (req: Request, res: Response) => {
  const usersService = new UsersService(req, res);
  const response = await usersService.login(req.body);

  if (response.hasErrors) {
    res.status(400);
    res.render(pages.login, response);
    return;
  }

  /* T3.2-REF1: cookie creation */

  const cookieData: UserCookie = {
    username: response.data.username,
    email: response.data.email,
    expiration: new Date(Date.now() + CookieAge.Minute),
  };

  res.cookie(Env.cookieName, cookieData, { maxAge: CookieAge.Minute });

  res.status(200);
  res.redirect(routes.home);
});

app.post(routes.register, async (req: Request, res: Response) => {
  const usersService = new UsersService(req, res);
  const response = await usersService.register(req.body);

  if (response.hasErrors) {
    res.status(400);
    res.render(pages.register, response);
    return;
  }

  const cookieData: UserCookie = {
    username: response.data.username,
    email: response.data.email,
    expiration: new Date(Date.now() + CookieAge.Minute),
  };

  res.cookie(Env.cookieName, cookieData, { maxAge: CookieAge.Minute });

  res.status(200);
  res.redirect(routes.home);
});

app.post(routes.logOut, async (req: Request, res: Response) => {
  res.clearCookie(Env.cookieName);
  req.session = null;

  res.status(200);
  res.redirect(routes.home);
});

app.get("*", async (_: Request, res: Response) => {
  res.status(404);
  res.render(pages.notFound);
});
//#endregion

app.use(errorHandler);

app.listen(port, () => {
  Logger.log(`Server is running at http://localhost:${port}`);
});
