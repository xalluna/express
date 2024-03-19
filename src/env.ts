import dotenv from "dotenv";
dotenv.config();

export type Env = {
  port: number;
  cookieName: string;
  mongoConnectionString: string;
  mongoDatabase: string;
};

export const Env: Env = {
  port: Number(process.env.PORT),
  cookieName: process.env.COOKIE_NAME as string,
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING as string,
  mongoDatabase: process.env.MONGO_DATABASE as string,
};

export type Table = {
  beegData: string;
  users: string;
};

export const Table: Table = {
  users: process.env.MONGO_TABLE_USERS as string,
  beegData: process.env.MONGO_TABLE_BEEG_DATA as string,
};
