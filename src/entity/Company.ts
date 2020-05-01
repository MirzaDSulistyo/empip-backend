import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    Unique,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty, IsEmail, IsPhoneNumber } from "class-validator";
import { User } from "../entity/User";
import { Product } from "./Product";
  
@Entity()
@Unique(["name"])
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
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

  @OneToMany(type => Product, product => product.company)
  products: Product[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}