import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Media } from "./entities/media.entity";

@Injectable()
export class MediaRepository extends Repository<Media> {
  constructor(@InjectRepository(Media) repository: Repository<Media>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
