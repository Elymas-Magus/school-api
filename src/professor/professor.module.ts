import { Module } from '@nestjs/common';
import { ProfessorsService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { Professor } from './entities/professor.entity';
import { ProfessorRepository } from './professor.repository';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [TypeOrmModule.forFeature([Professor])],
  controllers: [ProfessorController],
  providers: [ProfessorsService, ProfessorRepository]
})
export class ProfessorModule {
  constructor(private dataSource: DataSource){}
}
