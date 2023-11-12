import { PermissionRepository } from './permissions.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { RoleHasPermissionsModule } from '@app/role_has_permissions/role_has_permissions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Permission]), RoleHasPermissionsModule],
  providers: [PermissionsService, PermissionRepository]
})
export class PermissionsModule {}
