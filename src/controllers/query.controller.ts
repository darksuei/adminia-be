import { Request, Response } from "express";
import { QueryDto } from "../../@types";
import { userDatabaseConnection, fetchDataFromMongoDB } from "../utils/utils";

export const fetchDBData = async (req: Request, res: Response) => {
  console.log(req.body);
  const { connectionString, dbType, tableName } = <QueryDto>req.body;

  if (!connectionString || !dbType || !tableName)
    return res
      .status(400)
      .json({ error: "Invalid Request: Incomplet Parameters" });

  if (dbType !== "mysql" && dbType !== "postgres" && dbType !== "mongodb")
    return res.status(400).json({ error: "Unsupported database type" });

  let result;

  if (dbType === "mongodb") {
    result = await fetchDataFromMongoDB(connectionString, tableName);
  } else {
    const userDataSource = await userDatabaseConnection({
      connectionString,
      dbType,
      tableName,
    });
    result = await userDataSource
      .createQueryBuilder()
      .select()
      .from(tableName, "userTable")
      .addSelect("*") // Select all columns
      .getRawMany();
  }
  res.json({ result });
};
