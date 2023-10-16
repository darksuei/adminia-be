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
