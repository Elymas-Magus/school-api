import { Injectable } from '@nestjs/common';
import { In } from 'typeorm';
import { RoleHasPermission } from './entities/role_has_permission.entity';
import { RoleHasPermissionRepository } from './role_has_permissions.repository';

@Injectable()
export class RoleHasPermissionsService {
	constructor(private readonly roleHasPermRepo: RoleHasPermissionRepository) {}

  async list() {
    return this.roleHasPermRepo.find();
  }

	async find(id: number): Promise<RoleHasPermission | undefined> {
		const resp = await this.roleHasPermRepo.findOne({
			where: { id },
			relations: ['role', 'permission'],
		});
		return resp;
	}

	async findByRoleId(roleId: number): Promise<RoleHasPermission[]> {
		const resp = await this.roleHasPermRepo.find({
			where: { roleId },
			relations: ['role', 'permission'],
		});
		return resp;
	}

	async findByRoleIds(roleIds: number[]): Promise<RoleHasPermission[]> {
		const resp = await this.roleHasPermRepo.find({
			where: { roleId: In([ ...roleIds ]) },
			relations: ['role', 'permission'],
		});
		return resp;
	}

	async authorize(user: any, permission: string): Promise<Boolean> {
		const roleIds = user.modelHasRoles.map(modelHasRole => {
			return modelHasRole.roleId;
		})
		const resp = await this.findByRoleIds(roleIds);
    	const hasAccess = resp.some(item => item.permission.name == permission);
    
		return hasAccess;
	}
}
