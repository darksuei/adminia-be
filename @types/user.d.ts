import { Request } from "express";

export interface authType {
  name?: string;
  email?: string;
  password: string;
}

export interface userRequest extends Request {
  user?: authType;
}
