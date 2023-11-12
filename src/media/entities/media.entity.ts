import { Resource } from "@app/resources/entities/resource.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "media" })
export class Media {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ length: 256 })
  model_type: string; //model_resource or model_user

  @Column()
  model_id: number; //resource_id or user_id

  @Column({ length: 100 })
  collection_name: string; //pdf, images, texto, etc...

  @Column({ length: 256 }) //json properties
  metadata: string;

  @Column({ length: 256 }) //name of file
  filename: string;

  @Column({ length: 256 }) // image/png example
  mime_type: string;

  @Column({ length: 256 }) // url from bucket
  disk: string; //could be link or path

  @Column()
  size: number; //length of file

  url: string;

  @CreateDateColumn({ type: "timestamp", nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Resource, (resource) => resource.id)
  resource: Resource;
}
