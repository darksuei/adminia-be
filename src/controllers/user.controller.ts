import { NextFunction, Request, Response } from "express";
import { userDto, QueryDto } from "../../@types";
import { utils } from "../utils";
import { SALT_ROUNDS } from "../constants";

//db deets
import { AppDataSource } from "../../orm.config";
import { User } from "../entities/users";
import { fetchDB } from "../utils/utils";

//packages
const bcrypt = require("bcrypt");

//Todo: Use validation libraries to validate request bodies

export const getUser = async (req: userDto.userRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ email: req.user?.email });

    if (!user) {
      user = await userRepository.findOneBy({ name: req.user?.name });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    user!.password = ""; // USE TYPEORM SELECT

    //get the database
    const { connectionString, database, tableName } = user;
    const result = await fetchDB({
      connectionString,
      dbType: database as QueryDto["dbType"],
      tableName,
    });

    return res.status(200).json({ message: "User found", user, data: result });
  } catch (err) {
    next(err);
  }
};

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = <userDto.authType>req.body;
  if (!email && !password) return res.status(400).json({ message: "Incomplete Details" });

  try {
    const userRepository = AppDataSource.getRepository(User);

    let user: userDto.authType | null;
    if (email) {
      user = await userRepository.findOneBy({
        email: email,
      });
    } else {
      user = await userRepository.findOneBy({
        name: name,
      });
    }
    if (!user) return res.status(404).json({ message: "User does not exist" });
    const isUser = await bcrypt.compare(password, user.password);

    if (!isUser) return res.status(401).json({ message: "Invalid Password" });
    const token = utils.generateToken({ name, email, password });

    user.password = ""; // USE TYPEORM SELECT
    return res.status(200).json({
      message: "Login Successful",
      user: { ...user, token, expiresIn: "1d" },
    });
  } catch (error) {
    next(error);
  }
};

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = <userDto.authType>req.body;

  if (!name || !email || !password) return res.status(400).json({ message: "Incomplete Details" });

  // try {
  const userRepository = AppDataSource.getRepository(User);
  const existingUser = await userRepository.findOneBy({
    email: email,
  });

  if (existingUser) return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await utils.createUser({
    name,
    email,
    password: hashedPassword,
  });
  if (!user) return res.status(500).json({ message: "Error creating user." });

  const token = utils.generateToken({ name, email, password });
  user.password = "";

  return res.status(201).json({
    message: "User created successfully",
    user: { ...user, token, expiresIn: "1d" },
  });
  // } catch (error) {
  //   next(error);
  // }
};

export const updateUser = async (req: userDto.userRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const userRepository = AppDataSource.getRepository(User);
  let user = await userRepository.findOneBy({ email: req.user?.email });

  if (!user) user = await userRepository.findOneBy({ name: req.user?.name });

  if (!user) return res.status(404).json({ message: "User not found" });
  const newuser = { ...user, ...req.body };

  userRepository.save(newuser);
  return res.status(200).json({ message: "User found", user: newuser });
};

export const deleteUser = async (req: userDto.userRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userRepository = AppDataSource.getRepository(User);
    let user = await userRepository.findOneBy({ email: req.user?.email });

    if (!user) user = await userRepository.findOneBy({ name: req.user?.name });

    if (!user) return res.status(404).json({ message: "User not found" });

    await userRepository.delete(user.id);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};
