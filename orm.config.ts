import { config } from "dotenv";
import { DataSource } from "typeorm";
import { User } from "./src/entities/users";

config();

export const AppDataSource = new DataSource({
  type: "mongodb",
  url: process.env.DB_URI,
  entities: [User],
});
