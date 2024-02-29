// src/index.js
import express, { Express, Request, Response } from "express";
import { log, logger } from "./middleware/logger";
import { errorHandler } from "./middleware/error-handler";
import { Env } from "./env";
import { DataContext } from "./data/DataContext";
import { Document, Filter } from "mongodb";

const app: Express = express();
const port = Env.port || 3000;
app.set("view engine", "pug");
app.set("views", "./src/pages");

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200);
  res.render("home", { title: "Yo", message: "momma" });
});

app.get("/api/items/:name", async (req: Request, res: Response) => {
  const dataContext = DataContext.getInstance();
  const beegData = dataContext.collection("BeegData");

  const query = { name: req.params.name };

  console.log(query);

  const foo = await beegData.findOne(query);

  console.log(foo);

  res.status(200);
  res.contentType("application/json");
  res.send(foo);
});

app.get("/boss-hogg", (req: Request, res: Response) => {
  throw new Error("them duke boys are at it again");
});

app.use(errorHandler);

app.listen(port, () => {
  log(`Server is running at http://localhost:${port}`);
  log(Env.mongoConnectionString);
});
