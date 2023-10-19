import { User } from "../entities/users";
import { AppDataSource } from "../../orm.config";
import {
  userDto,
  QueryDto,
  InsertQueryDto,
  DeleteQueryDto,
  UpdateQueryDto,
} from "../../@types";
import { createUserDataSource } from "./userOrm.config";
import { MongoClient, ObjectId } from "mongodb";

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
    return result;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.close();
  }
};

export const insertDataToMongoDB = async (
  connectionString: string,
  tableName: string,
  new_data: any
) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db();

    const collection = db.collection(tableName);

    const documentWithId = {
      _id: new ObjectId(Math.random() * 99999999999), //INTERESTING FIX HEHE
      ...new_data,
    };

    const result = await collection.insertOne(documentWithId);
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Insert Failed");
  } finally {
    await client.close();
  }
};

async function deleteMongoDataById({
  connectionString,
  tableName,
  idToDelete,
}: DeleteQueryDto) {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection(tableName);

    const objectIdToDelete = new ObjectId(idToDelete);

    const deleteResult = await collection.deleteOne({
      _id: objectIdToDelete,
    });

    if (deleteResult.deletedCount === 1) {
      console.log("Document with ID", idToDelete, "deleted successfully.");
      return true;
    } else {
      console.log("Document not found or deletion failed.");
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return new Error("An error occured");
  } finally {
    await client.close();
  }
}

export const fetchDB = async ({
  connectionString,
  dbType,
  tableName,
}: QueryDto) => {
  try {
    if (!connectionString || !dbType || !tableName)
      return new Error("Invalid Request, Incomplete Parameters");

    if (dbType !== "mysql" && dbType !== "postgres" && dbType !== "mongodb")
      return new Error("Unsupported database!");

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
    return result;
  } catch (err) {
    return new Error("Internal Server Error");
  }
};

export const insertToUserDB = async ({
  new_data,
  dbType,
  connectionString,
  tableName,
}: InsertQueryDto) => {
  try {
    let result;
    if (dbType === "mongodb") {
      result = insertDataToMongoDB(connectionString, tableName, new_data);
    } else {
      const userDataSource = await userDatabaseConnection({
        connectionString,
        dbType,
        tableName,
      });
      result = await userDataSource //NEEDS FURTHER TESTING
        .createQueryBuilder()
        .insert()
        .into(tableName)
        .values(new_data)
        .execute();
    }
    return result;
  } catch (err) {
    console.error(err);
    return new Error("Internal Server Error");
  }
};

const updateMongoDataById = async ({
  connectionString,
  tableName,
  dbType,
  idToUpdate,
  updateData,
}: UpdateQueryDto) => {
  const client = new MongoClient(connectionString);

  try {
    await client.connect();
    const db = client.db();

    const collection = db.collection(tableName);
    const objectIdToUpdate = new ObjectId(idToUpdate);
    console.log(objectIdToUpdate, idToUpdate);

    const result = await collection.updateOne(
      { _id: objectIdToUpdate },
      {
        $set: updateData,
      }
    );
    if (result.modifiedCount === 1) {
      console.log("Document with ID", idToUpdate, "updated successfully.");
    } else {
      console.log("Document not found or no changes made.");
    }
    return result;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Insert Failed");
  } finally {
    await client.close();
  }
};

export const updateUserDB = async ({
  connectionString,
  tableName,
  idToUpdate,
  dbType,
  updateData,
}: UpdateQueryDto) => {
  try {
    let result;
    if (dbType === "mongodb") {
      result = updateMongoDataById({
        connectionString,
        tableName,
        dbType,
        idToUpdate,
        updateData,
      });
    } else {
      result = null;
    }
    return result;
  } catch (err) {
    console.error(err);
    return new Error("Internal Server Error");
  }
};

export const deleteUserDB = async ({
  connectionString,
  tableName,
  idToDelete,
  dbType,
}: DeleteQueryDto) => {
  try {
    let result;
    if (dbType === "mongodb") {
      result = deleteMongoDataById({
        connectionString,
        tableName,
        dbType,
        idToDelete,
      });
    } else {
      result = null;
    }
    return result;
  } catch (err) {
    console.error(err);
    return new Error("Internal Server Error");
  }
};

export const deleteAllMongoData = async ({
  connectionString,
  tableName,
  dbType,
}: QueryDto) => {
  try {
    const client = new MongoClient(connectionString);

    await client.connect();
    const db = client.db();

    const collection = db.collection(tableName);

    const result = await collection.deleteMany({});
    if (result.deletedCount) {
      console.log("Whole Document deleted successfully.");
    } else {
      console.log("Did not delete successfully.");
    }
  } catch (err) {
    console.error(err);
    return new Error("Internal Server Error");
  }
};

export const deleteAllUserDB = async ({
  connectionString,
  tableName,
  dbType,
}: QueryDto) => {
  try {
    let result;
    if (dbType === "mongodb") {
      result = deleteAllMongoData({
        connectionString,
        tableName,
        dbType,
      });
    } else {
      result = null;
    }
    return result;
  } catch (err) {
    console.error(err);
    return new Error("Internal Server Error");
  }
};
