import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { ServiceVariant } from "./ServiceVariant";
import { Company } from "./Company";
  
export type ServiceAvailableType = "anyone" | "male" | "female";

@Entity()
export class Service {
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

  @Column({
    type: "enum",
    enum: ["anyone", "male", "female"],
    default: "anyone"
  })
  available: ServiceAvailableType

  @OneToMany(type => ServiceVariant, variant => variant.service)
  variants: ServiceVariant[];

  @ManyToOne(type => Company, company => company.services)
  company: Company;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}