import { BaseRequestMessages } from '@app/common/BaseModels/BaseEnums/base-request-messages.enum';
import { BaseRequestResult } from '@app/common/BaseModels/base-Request-Result.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { ProfessorsService } from './professor.service';

@ApiTags('Professores')
@Controller('professors')
export class ProfessorController {
  constructor(private readonly professorService: ProfessorsService) {}

  @Post()
  async create(@Body() createProfessorDto: CreateProfessorDto) {
    try {
      const result = await this.professorService.create(createProfessorDto);
      return new BaseRequestResult(
        HttpStatus.CREATED,
        BaseRequestMessages.Created,
        result
      );
    } catch (e){
      return e;
    }
  }

  @Get()
  async list() {
    try {
      const result = await this.professorService.list();
      const response = new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProfessorDto: UpdateProfessorDto) {
    try {
      const result = await this.professorService.update(+id, updateProfessorDto);
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Updated,
        result
      );
    }
    catch (e) {
      return e;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.professorService.remove(+id);
      return new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted);
    } catch (e){
      return e;
    }
  }
}
