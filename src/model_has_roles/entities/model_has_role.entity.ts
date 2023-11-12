import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "@app/roles/entities/role.entity";
import { User } from "@app/users/entities/user.entity";

@Entity({ name: 'model_has_roles' })
export class ModelHasRole {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'bigint', unsigned: true })
    userId: number

    @Column({ type: 'bigint', unsigned: true })
    roleId: number

    @ManyToOne(() => Role, (role) => role.id)
    role: Role

    @ManyToOne(() => User, (user) => user.id)
    user: User
}
