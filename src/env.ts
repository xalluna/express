import dotenv from "dotenv";
dotenv.config();

type MongoTables = {
  beegData: string;
  users: string;
};

export type Env = {
  port: number;
  mongoConnectionString: string;
  mongoDatabase: string;
  mongoTables: MongoTables;
};

export const Env: Env = {
  port: Number(process.env.PORT),
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING as string,
  mongoDatabase: process.env.MONGO_DATABASE as string,
  mongoTables: {
    users: process.env.MONGO_TABLE_USERS as string,
    beegData: process.env.MONGO_TABLE_BEEG_DATA as string,
  },
};
