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
import { Service } from "./Service";
import { Class } from "./Class";
import { Voucher } from "./Voucher";
import { Asset } from "./Asset";
import { Membership } from "./Membership";
  
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

  @OneToMany(type => Service, service => service.company)
  services: Service[];

  @OneToMany(type => Class, c => c.company)
  classes: Class[];

  @OneToMany(type => Asset, asset => asset.company)
  assets: Asset[];

  @OneToMany(type => Voucher, voucher => voucher.company)
  vouchers: Voucher[];

  @OneToMany(type => Membership, member => member.company)
  memberships: Membership[];

  @Column()
  freeDeliveryFee: number;

  @Column()
  freeDeliveryRadius: number;

  @Column()
  freeDeliveryPerUnit: number;

  @Column()
  @Length(1, 20)
  deliveryMeasurementUnit: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;
}