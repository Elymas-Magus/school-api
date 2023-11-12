import { Media } from "@app/media/entities/media.entity";
import { Subject } from "@app/subject/entities/subject.entity";
import { User } from "@app/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "resources" })
export class Resource {
  @PrimaryGeneratedColumn({ type: "bigint", unsigned: true })
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ default: "", length: 1024 })
  description: string;

  @Column({ default: false })
  activated: boolean;

  @RelationId((resource: Resource) => resource.creator)
  creatorId: number;

  @RelationId((resource: Resource) => resource.subject)
  subjectId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  creator: User;

  @ManyToOne(() => Subject, (subject) => subject.id)
  subject: Subject;

  @OneToMany(() => Media, (media) => media.resource)
  media: Media[];
}
