import { AppDataSource } from "../../orm.config";

const databaseConnection = async (Users: any) => {
  const connection = await AppDataSource.initialize();

  console.log("Successfully connected to the database.");

  return connection.getRepository(Users);
};

export default databaseConnection;
