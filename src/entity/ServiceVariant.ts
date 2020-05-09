import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Service } from "./Service";
  
@Entity()
export class ServiceVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 50)
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  price: number;

  @Column()
  specialPrice: number;

  @ManyToOne(type => Service, service => service.variants)
  service: Service;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}