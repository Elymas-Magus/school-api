import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subject } from "./entities/subject.entity";
import { SubjectController } from "./subject.controller";
import { SubjectRepository } from "./subject.repository";
import { SubjectService } from "./subject.service";

@Module({
  imports: [TypeOrmModule.forFeature([Subject])],
  controllers: [SubjectController],
  exports: [SubjectService],
  providers: [SubjectService, SubjectRepository],
})
export class SubjectModule {}
