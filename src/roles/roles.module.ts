import { ModelHasRole } from '@app/model_has_roles/entities/model_has_role.entity';
import { RoleHasPermissionsModule } from './../role_has_permissions/role_has_permissions.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { RoleHasPermission } from '@app/role_has_permissions/entities/role_has_permission.entity';
// import { RolesController } from './roles.controller';

@Module({
  // controllers: [RolesController],
	imports: [TypeOrmModule.forFeature([Role, RoleHasPermission, ModelHasRole])],
  providers: [RolesService]
})
export class RolesModule {}
