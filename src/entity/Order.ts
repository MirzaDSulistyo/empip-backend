import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn,
    ManyToMany,
    JoinTable
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Company } from "./Company";
import { Product } from "./Product";
import { Service } from "./Service";
import { Class } from "./Class";
import { Package } from "./Package";
import { Asset } from "./Asset";
import { Voucher } from "./Voucher";
import { Plan } from "./Plan";
import { Membership } from "./Membership";
import { User } from "./User";

export type OrderType = "1#sameday" | "2#scheduled" | "3#takeout" | "4#booking" | "5#voucher" | "6#class" | "7#plan" | "8#dinein" | "9#rent";
  
@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  //YY-MM-DD + 8 char 0-9A-Z
  @Column()
  @IsNotEmpty()
  invoiceNumber: string;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(8, 1000)
  @IsNotEmpty()
  descriptions: string;

  @ManyToOne(type => Company, company => company.products)
  company: Company;

  @Column({
    type: "enum",
    enum: ["1#sameday", "2#scheduled", "3#takeout", "4#booking", "5#voucher", "6#class", "7#plan", "8#dinein", "9#rent", "10#member", "11#deal"],
    default: "7#plan"
  })
  type: OrderType

  @Column()
  @Length(6, 10)
  @IsNotEmpty()
  date: string;

  @Column()
  @Length(6, 10)
  @IsNotEmpty()
  time: string;

  @ManyToMany(type => Product)
  @JoinTable()
  products: Product[];

  @ManyToMany(type => Service)
  @JoinTable()
  services: Service[];

  @ManyToMany(type => Class)
  @JoinTable()
  classes: Class[];

  @ManyToMany(type => Package)
  @JoinTable()
  packages: Package[];

  @ManyToMany(type => Asset)
  @JoinTable()
  assets: Asset[];

  @ManyToMany(type => Voucher)
  @JoinTable()
  vouchers: Voucher[];

  @ManyToMany(type => Plan)
  @JoinTable()
  plans: Plan[];

  @ManyToMany(type => Membership)
  @JoinTable()
  memberships: Membership[];

  @Column()
  notes: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @ManyToOne(type => User, user => user.orders)
  user: User;

  @Column()
  isMembershipOrder: boolean;

  @Column({nullable: true})
  orderTotal: number;

  @Column({nullable: true})
  subTotal: number;

  @Column({nullable: true})
  latitude: string;

  @Column({nullable: true})
  longitude: string;

  @Column()
  status: string;

  @Column({nullable: true})
  deliveryFee: number;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}