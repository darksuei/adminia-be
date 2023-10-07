import { User } from "../entities/users";
import { AppDataSource } from "../../orm.config";
import { userDto } from "../../@types";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async ({
  name,
  email,
  password,
}: userDto.authType) => {
  try {
    if (!name || !email || !password) throw new Error("Incomplete Details");
    let user = new User();
    user.name = name!;
    user.email = email!;
    user.password = password;
    await AppDataSource.manager.save(user);
    return user;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const generateToken = ({ name, email, password }: userDto.authType) => {
  let tokenObj: userDto.authType;
  if (name) {
    tokenObj = {
      name,
      password,
    };
  } else {
    tokenObj = {
      email,
      password,
    };
  }
  const token: string = jwt.sign(tokenObj, JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};

export const hashString = async (str: string) => {
  const hash = await bcrypt.hash(str, 10);
  return hash;
};
