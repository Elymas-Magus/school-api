import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Subject } from "./entities/subject.entity";

@Injectable()
export class SubjectRepository extends Repository<Subject> {
  constructor(@InjectRepository(Subject) repository: Repository<Subject>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
