import { RoleHasPermission } from '@app/role_has_permissions/entities/role_has_permission.entity';
import { ModelHasRole } from '@app/model_has_roles/entities/model_has_role.entity';
import {
    Column,
    Entity,
    OneToMany,
    JoinColumn,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ name: "roles" })
export class Role {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    guardName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ModelHasRole, modelHasRole => modelHasRole.user)
    @JoinColumn()
    modelHasRoles: ModelHasRole[]; 

    @OneToMany(() => RoleHasPermission, roleHasPermission => roleHasPermission.role)
    @JoinColumn()
    roleHasPermission: RoleHasPermission[]
}
