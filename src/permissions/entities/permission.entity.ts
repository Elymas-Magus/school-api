import { RoleHasPermission } from '@app/role_has_permissions/entities/role_has_permission.entity';
import {
    Entity,
    Column,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity({ name: "permissions"})
export class Permission {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    guardName: string;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;

    @OneToMany(() => RoleHasPermission, (roleHasPermission) => roleHasPermission.permission)
    @JoinColumn()
    roleHasPermission: RoleHasPermission[]
};
