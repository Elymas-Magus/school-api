import { ModelHasRole } from '@app/model_has_roles/entities/model_has_role.entity';
import { User } from '@app/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Permission } from './entities/permission.entity';
import { PermissionRepository } from './permissions.repository';
import { RoleHasPermissionsService } from '@app/role_has_permissions/role_has_permissions.service';

@Injectable()
export class PermissionsService {
	constructor(
		private readonly permRepo: PermissionRepository,
		private readonly roleHasPermService: RoleHasPermissionsService
	) {}

	async list() {
		return this.permRepo.find();
	}

	async find(id: number): Promise<Permission | undefined> {
		const resp = await this.permRepo.findOne({
			where: { id },
			relations: ['roleHasPermission'],
		});
		return resp;
	}

	async findByRoleId(roleId: number): Promise<Permission[]> {
		const resp = await this.roleHasPermService.findByRoleId(roleId);
		return resp.map(item => item.permission);
	}

	async findByRoleIdList(roleIds: number[]): Promise<Permission[]> {
		const resp = await this.roleHasPermService.findByRoleIds(roleIds);
		return resp.map(item => item.permission);
	}

	async listUserPermissions(user: any): Promise<Permission[]> {
		const roleIds = user.modelHasRoles.map(modelHasRole => {
			return modelHasRole.roleId;
		})
		return this.findByRoleIdList(roleIds);
	}
}
