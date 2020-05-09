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
import { ClassSession } from "./ClassSession";
import { Company } from "./Company";
  
export type ClassAvailableType = "anyone" | "male" | "female";

@Entity()
export class Class {
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
  available: ClassAvailableType

  @OneToMany(type => ClassSession, session => session.class)
  sessions: ClassSession[];

  @ManyToOne(type => Company, company => company.classes)
  company: Company;

  @Column({select: false})
  @CreateDateColumn()
  createdAt: Date;

  @Column({select: false})
  @UpdateDateColumn()
  updatedAt: Date;
}