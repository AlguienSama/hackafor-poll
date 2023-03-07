import express, { Application } from "express";
import morgan from "morgan";

import { router } from "./routes/index";
import { AppDataSource } from "@src/dataSource";

const server = async () => {
  try {
    const db = await AppDataSource.initialize()
    console.log("DDBB connected!")
  } catch (err) {
    console.error("Error DDBB connection", err)
  }

  const app: Application = express();

  app.use(express.json());
  app.use(morgan("dev"));
  app.use(express.static("public"));
  app.use('/', router);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });
}

server().catch(e => console.log(e));