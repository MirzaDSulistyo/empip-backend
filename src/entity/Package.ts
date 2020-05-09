import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Product } from "./Product";
  
@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  comId: number;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  name: string;

  @Column()
  @Length(8, 1000)
  descriptions: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column()
  specialPrice: number;

  @OneToMany(type => Product, product => product.package)
  products: Product[];

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}