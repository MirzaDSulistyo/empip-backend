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
import { Membership } from "./Membership";

export type PlanType = "1#product" | "2#service" | "3#class" | "4#package" | "5#asset";
export type PlanPeriodicType = "1#daily" | "2#weekly" | "3#monthly" | "4#weekend" | "5#weekdays" | "6#custom";
  
@Entity()
export class Plan {
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

  @ManyToOne(type => Company, company => company.products)
  company: Company;

  @Column({
    type: "enum",
    enum: ["1#daily", "2#weekly", "3#monthly", "4#weekend", "5#weekdays", "6#custom"],
    default: "3#monthly"
  })
  periodic: PlanPeriodicType

  @Column({
    type: "enum",
    enum: ["1#product", "2#service", "3#class", "4#package", "5#asset", "6#deals", "7#membership"],
    default: "1#product"
  })
  type: PlanType

  @Column()
  @Length(1, 50)
  @IsNotEmpty()
  days: string;

  @Column()
  @Length(6, 10)
  @IsNotEmpty()
  startDate: string;

  @Column()
  @Length(6, 10)
  @IsNotEmpty()
  endDate: string;

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

  @ManyToMany(type => Membership)
  @JoinTable()
  memberships: Membership[];

  @Column()
  notes: string;

  @Column()
  @IsNotEmpty()
  address: string;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}