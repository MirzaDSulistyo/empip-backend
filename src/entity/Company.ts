import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty, IsEmail, IsString, IsPhoneNumber } from "class-validator";
import * as bcrypt from "bcryptjs";
import { User } from "../entity/User";
  
@Entity()
@Unique(["name"])
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 50)
  @IsString()
  name: string;

  @Column()
  @Length(4, 50)
  @IsString()
  description: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @IsPhoneNumber("ZZ")
  phone: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @ManyToOne(type => User, user => user.companies)
  user: User;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}