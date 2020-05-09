import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Company } from "./Company";

@Entity()
export class Voucher {
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
  @Length(8, 1000)
  @IsNotEmpty()
  startDate: string;

  @Column()
  @Length(8, 1000)
  @IsNotEmpty()
  endDate: string;

  @Column()
  @Length(8, 1000)
  @IsNotEmpty()
  messages: string;

  @ManyToOne(type => Company, company => company.vouchers)
  company: Company;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}