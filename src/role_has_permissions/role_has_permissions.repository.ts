import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleHasPermission } from '@app/role_has_permissions/entities/role_has_permission.entity';

@Injectable()
export class RoleHasPermissionRepository extends Repository<RoleHasPermission> {
	constructor(@InjectRepository(RoleHasPermission) repository: Repository<RoleHasPermission>) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}