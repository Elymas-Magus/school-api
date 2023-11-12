import { Injectable, Res } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Resource } from "@app/resources/entities/resource.entity";

@Injectable()
export class ResourceRepository extends Repository<Resource> {
  constructor(@InjectRepository(Resource) repository: Repository<Resource>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
