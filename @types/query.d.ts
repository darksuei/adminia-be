import { Condition } from "typeorm";

export interface QueryDto {
  projectName?: string;
  connectionString: string;
  dbType: "mongodb" | "postgres" | "mysql";
  username?: string;
  password?: string;
  tableName: string;
}

export interface InsertQueryDto extends QueryDto {
  new_data: any;
}

export interface DeleteQueryDto extends QueryDto {
  idToDelete: Condition<ObjectId> | undefined;
}
