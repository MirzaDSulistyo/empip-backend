import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Company } from "./Company";
  
@Entity()
export class Membership {
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
  specialPrice: number;

  // slot of member available
  @Column()
  @IsNotEmpty()
  slot: number;

  @ManyToOne(type => Company, company => company.memberships)
  company: Company;

  // is this membership can take unlimited member
  @Column()
  isUnlimited: boolean;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}