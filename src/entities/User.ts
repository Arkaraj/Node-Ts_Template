import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("varchar", { unique: true, length: 150 })
  email: string;

  @Column("text")
  name: string;

  @Column("text")
  password: string;
}
