import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from '@app/permissions/entities/permission.entity';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
	constructor(@InjectRepository(Permission) repository: Repository<Permission>) {
		super(repository.target, repository.manager, repository.queryRunner);
	}
}