import { auth } from "../middlewares/auth.middleware";
import { insertToDB, deleteFromDB, updateDB, getDB, deleteAllFromDB } from "../controllers/query.controller";

const Router = require("express").Router;

const router = Router();

router.get("/get_db", auth, getDB);

router.post("/insert_to_db", auth, insertToDB);

router.patch("/update_db", auth, updateDB);

router.patch("/delete_from_db", auth, deleteFromDB);

router.patch("/delete_all_from_db", auth, deleteAllFromDB);

module.exports = router;
