import { MongoClient, Db } from "mongodb";
import { Env } from "../env";

export class DataContext {
  private static instance: Db;
  private constructor() {}

  public static getInstance() {
    if (!DataContext.instance) {
      const client = new MongoClient(Env.mongoConnectionString);

      DataContext.instance = client.db(Env.mongoDatabase);
    }

    return DataContext.instance;
  }
}
