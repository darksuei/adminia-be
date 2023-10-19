import { NextFunction, Request, Response } from "express";
import {
  QueryDto,
  userDto,
  DeleteQueryDto,
  UpdateQueryDto,
} from "../../@types";
import {
  fetchDB,
  insertToUserDB,
  updateUserDB,
  deleteUserDB,
  deleteAllUserDB,
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

export const insertToDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const new_data = req.body;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ email: req.user?.email });

    if (!user) user = await userRepository.findOneBy({ name: req.user?.name });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { connectionString, database, tableName } = user;

    const result = await insertToUserDB({
      new_data,
      dbType: database as QueryDto["dbType"],
      connectionString,
      tableName,
    });

    return res.status(200).json({
      message: "Insert Successful",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const updateDB = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, updateData } = req.body;
    // if (Object.keys(updateData).filter((item) => item === "_id"))
    //   return res.status(404).json({
    //     message: "Error, you cannot update _id",
    //   });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ email: req.user?.email });

    if (!user) user = await userRepository.findOneBy({ name: req.user?.name });

    if (!user) return res.status(404).json({ message: "User not found" });
    const { connectionString, database, tableName } = user;

    const result = updateUserDB({
      connectionString,
      tableName,
      idToUpdate: id,
      dbType: database as UpdateQueryDto["idToUpdate"],
      updateData,
    });
    if (!result)
      return res.status(404).json({
        message: "Update Failed",
      });
    return res.status(200).json({
      message: "Update Successful",
      id,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFromDB = async (
  req: Request,
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
    const { id } = req.body;

    const result = await deleteUserDB({
      connectionString,
      tableName,
      idToDelete: id as DeleteQueryDto["idToDelete"],
      dbType: database as QueryDto["dbType"],
    });
    if (!result)
      return res.status(404).json({
        message: "Delete Failed",
      });
    return res.status(200).json({
      message: "Delete Successful",
      id,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAllFromDB = async (
  req: Request,
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

    const result = await deleteAllUserDB({
      connectionString,
      tableName,
      dbType: database as QueryDto["dbType"],
    });
    if (!result)
      return res.status(404).json({
        message: "Delete Failed",
      });
    return res.status(200).json({
      message: "Delete Successful",
    });
  } catch (err) {
    next(err);
  }
};
