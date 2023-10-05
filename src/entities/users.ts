import { Entity, ObjectIdColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class Users {
  @ObjectIdColumn()
  id!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;
}
