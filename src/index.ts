// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { logger } from "./middleware/logger";
import moment from "moment";
import { errorHandler } from "./middleware/error-handler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
app.set("view engine", "pug");
app.set("views", "./src/pages");

app.use(logger);

app.get("/", (req: Request, res: Response) => {
  res.status(200);
  res.render("home", { title: "Yo", message: "momma" });
});

app.get("/foo", (req: Request, res: Response) => {
  throw new Error("them duke boys are at it again");
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(
    `[${moment().format()}]: Server is running at http://localhost:${port}`
  );
});
