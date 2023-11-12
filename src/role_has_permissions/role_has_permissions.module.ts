import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleHasPermission } from './entities/role_has_permission.entity';
import { RoleHasPermissionsService } from './role_has_permissions.service';
import { Role } from '@app/roles/entities/role.entity';
import { RoleHasPermissionRepository } from './role_has_permissions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleHasPermission, Role])],
  exports: [RoleHasPermissionsService],
  providers: [RoleHasPermissionsService, RoleHasPermissionRepository]
})
export class RoleHasPermissionsModule {}
