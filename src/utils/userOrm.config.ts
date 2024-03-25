import { config } from "dotenv";
import { DataSource } from "typeorm";
import { QueryDto } from "../../@types";

config();

export const createUserDataSource = async ({ dbType, connectionString }: QueryDto) => {
  const userDataSource = new DataSource({
    type: dbType,
    url: connectionString,
    synchronize: true,
  });

  return userDataSource;
};
