import { Request, Response } from "express";
const express = require("express");
import { userDto } from "../../@types";
import { hashString } from "../utils";

const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = <userDto.loginType>req.body;
    const hashedPassword = await hashString(password);
  } catch (err) {}
};
