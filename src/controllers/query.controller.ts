import { NextFunction, Request, Response } from "express";
import { QueryDto, userDto } from "../../@types";
import {
  userDatabaseConnection,
  fetchDataFromMongoDB,
  fetchDB,
} from "../utils/utils";

//db deets
import { AppDataSource } from "../../orm.config";
import { User } from "../entities/users";

//Logic
export const getDB = async (
  req: userDto.userRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ email: req.user?.email });

    if (!user) user = await userRepository.findOneBy({ name: req.user?.name });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { connectionString, database, tableName } = user;
    const result = await fetchDB({
      connectionString,
      dbType: database as QueryDto["dbType"],
      tableName,
    });
    return res.status(200).json({
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDB = async () => {};

export const deleteFromDB = async () => {};

export const insertToDB = async () => {};
