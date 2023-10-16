import { Request, Response } from "express";
import {
  insertToDB,
  deleteFromDB,
  updateDB,
  getDB,
} from "../controllers/query.controller";
import { auth } from "../middlewares/auth.middleware";

const Router = require("express").Router;

const router = Router();

router.get("/get_db", auth, getDB);

router.post("/insert_to_db", auth, insertToDB);

router.patch("/update_db", auth, updateDB);

router.patch("/delete_from_db", auth, deleteFromDB);

module.exports = router;
