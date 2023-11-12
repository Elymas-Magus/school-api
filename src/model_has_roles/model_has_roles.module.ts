import { Role } from '@app/roles/entities/role.entity';
import { User } from '@app/users/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelHasRole } from './entities/model_has_role.entity';
import { ModelHasRolesService } from './model_has_roles.service';

@Module({
	imports: [TypeOrmModule.forFeature([ModelHasRole, User, Role])],
  providers: [ModelHasRolesService]
})
export class ModelHasRolesModule {}
