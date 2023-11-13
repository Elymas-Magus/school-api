import { ModelHasRole } from "@app/model_has_roles/entities/model_has_role.entity";
import { Resource } from "@app/resources/entities/resource.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 255, unique: true })
  email: string;

  @Column({ length: 255, default: "" })
  password: string;

  @Column({ default: false })
  activated: boolean;

  @Column({ default: false })
  forbidden: boolean;

  @Column({ length: 15 })
  sex: string;

  @Column({ length: 11, unique: true })
  register_number: string;

  @Column({ type: "timestamp", nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToMany(() => Resource, (resource) => resource.creator)
  @JoinColumn()
  resources: Resource[];

  @OneToMany(() => ModelHasRole, (modelHasRoles) => modelHasRoles.user)
  @JoinColumn()
  modelHasRoles: ModelHasRole[];
}
