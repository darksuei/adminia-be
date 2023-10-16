import { Request, Response } from "express";
import { fetchDBData } from "../controllers/query.controller";

const Router = require("express").Router;

const router = Router();

router.post("/url", fetchDBData);

module.exports = router;
