export interface QueryDto {
  projectName?: string;
  connectionString: string;
  dbType: "mongodb" | "postgres" | "mysql";
  username?: string;
  password?: string;
  tableName: string;
}
