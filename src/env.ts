import dotenv from "dotenv";
dotenv.config();

export type Env = {
  port: number;
  mongoConnectionString: string;
  mongoDatabase: string;
};

export const Env: Env = {
  port: Number(process.env.PORT),
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING as string,
  mongoDatabase: process.env.MONGO_DATABASE as string,
};
