import express, { Express, Request, Response } from "express";
import { Logger } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { DataContext } from "./data/data-context";
import { Env, Table } from "./env";
import cookieSession from "cookie-session";
import { CookieAge } from "./common/cookie-age";

const app: Express = express();
const port = Env.port || 3000;
app.set("view engine", "pug");
app.set("views", "./src/pages");

app.use(Logger.middleware);
app.use(
  cookieSession({
    name: Env.cookieName,
    keys: ["username", "email"],
    maxAge: CookieAge.Day,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200);
  res.render("home", { title: "Yo", message: "momma" });
});

app.get("/api/items/:name", async (req: Request, res: Response) => {
  const dataContext = DataContext.getInstance();
  const beegData = dataContext.collection(Table.beegData);

  const query = { name: req.params.name };
  const data = await beegData.findOne(query);

  console.log(data);

  res.status(200);
  res.contentType("application/json");
  res.send(data);
});

app.get("/boss-hogg", (req: Request, res: Response) => {
  throw new Error("them duke boys are at it again");
});

app.use(errorHandler);

app.listen(port, () => {
  Logger.log(`Server is running at http://localhost:${port}`);
});
