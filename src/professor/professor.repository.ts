import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Professor } from "@app/professor/entities/professor.entity";

@Injectable()
export class ProfessorRepository extends Repository<Professor> {
  constructor(@InjectRepository(Professor) repository: Repository<Professor>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
