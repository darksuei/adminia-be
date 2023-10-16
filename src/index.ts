import { Request, Response } from "express";
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
import { ErrorHandler } from "./middlewares/error.middleware";

// import model
import { User } from "./entities/users";

// regster middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//db connection
import databaseConnection from "./utils/database";
databaseConnection(User);

// import routes
import routes from "./routes";

// register routes
app.use("/api", routes.userRouter);
app.use("/api", routes.queryRouter);

//Error handler is last middleware
app.use(ErrorHandler);

app.get("*", (req: Request, res: Response) => {
  res.send("Server Running!");
});

app.listen(5000, () => {
  console.log("Running on port 5000");
});
