import { Resource } from "@app/resources/entities/resource.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "subject" })
export class Subject {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ length: 100 })
  name: string;

  
  @Column({ length: 800 })
  goal: string;

  @Column({ length: 256 })
  curriculum: string; //ementa -- provavelmente será um link para o pdf da ementa

  @Column({ type: "bigint" })
  ch_total: number;

  @Column()
  period: number;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToMany((type) => Resource, (resource) => resource.id)
  resources: Resource;
}
