import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import { Class } from "./Class";
  
@Entity()
export class ClassSession {
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

  @Column()
  @IsNotEmpty()
  startDate: string;

  @Column()
  @IsNotEmpty()
  endDate: string;

  @Column()
  @IsNotEmpty()
  days: string;

  @Column()
  @IsNotEmpty()
  startTime: string;

  @Column()
  @IsNotEmpty()
  duration: number;

  @Column()
  @IsNotEmpty()
  blockingDates: string;

  @ManyToOne(type => Class, c => c.sessions)
  class: Class;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}