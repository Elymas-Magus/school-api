import {
    Entity,
    Column,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm';
import { Permission } from '@app/permissions/entities/permission.entity';
import { Role } from '@app/roles/entities/role.entity';

@Entity({ name: "role_has_permissions"})
export class RoleHasPermission {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'bigint', unsigned: true })
    permiossionId: number

    @Column({ type: 'bigint', unsigned: true })
    roleId: number

    @ManyToOne(() => Role, (role) => role.id)
    role: Role

    @ManyToOne(() => Permission, (permission) => permission.id)
    permission: Permission
}
