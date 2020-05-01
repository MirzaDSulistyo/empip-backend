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
import { User } from "./User";
import { Company } from "./Company";
  
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(8, 1000)
  @IsNotEmpty()
  descriptions: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column()
  @IsNotEmpty()
  stock: number;

  @ManyToOne(type => Company, company => company.products)
  company: Company;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}