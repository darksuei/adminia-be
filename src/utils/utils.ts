import { User } from "../entities/users";
import { AppDataSource } from "../../orm.config";
import { userDto, QueryDto } from "../../@types";
import { createUserDataSource } from "./userOrm.config";
import { MongoClient } from "mongodb";

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

export const userDatabaseConnection = async ({
  dbType,
  connectionString,
  tableName,
}: QueryDto) => {
  const userDataSource = await createUserDataSource({
    dbType,
    connectionString,
    tableName,
  });
  userDataSource
    .initialize()
    .then(() => {
      console.log("User Data Source has been initialized!");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization", err);
    });
  return userDataSource;
};

export const fetchDataFromMongoDB = async (
  connectionString: string,
  tableName: string
) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db();

    const collection = db.collection(tableName);

    const result = await collection.find({}).toArray();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
};
