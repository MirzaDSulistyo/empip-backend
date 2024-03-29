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
import { Package } from "./Package";
  
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
  specialPrice: number;

  @Column()
  @IsNotEmpty()
  stock: number;

  @ManyToOne(type => Company, company => company.products)
  company: Company;

  @ManyToOne(type => Package, p => p.products, { onDelete: 'SET NULL' })
  package: Package;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}