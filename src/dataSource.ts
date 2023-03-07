import "reflect-metadata"
import path from "path";
import { DataSource } from "typeorm"
import dotenv from 'dotenv';
import { UserEntity } from "./entities/user.entity";
import { PollEntity } from '@entities/poll.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT || '5432'),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  logging: true,
  entities: [
    UserEntity, PollEntity
  ],
  migrations: [
    "src/migration/*.ts"
  ],
  subscribers: [
    "src/subscriber/*.ts"
  ]
});