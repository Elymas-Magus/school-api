import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelHasRolesService {
  findAll() {
    return `This action returns all modelHasRoles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modelHasRole`;
  }
}
