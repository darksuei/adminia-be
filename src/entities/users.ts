import { Entity, ObjectIdColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @ObjectIdColumn()
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  database!: string;

  @Column()
  connectionString!: string;

  @Column()
  databaseUserName!: string;

  @Column()
  databasePassword!: string;

  @Column()
  tableName!: string;

  @Column()
  projectName!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
