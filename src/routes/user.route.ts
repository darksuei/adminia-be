const Router = require("express").Router;

const router = Router();

import {
  signUpUser,
  getUser,
  signInUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

router.get("/user", auth, getUser);

router.post("/user", signInUser);

router.patch("/user", auth, updateUser);

router.delete("/user", auth, deleteUser);

router.post("/new_user", signUpUser);

module.exports = router;
