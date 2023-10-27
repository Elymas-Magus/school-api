import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { Professor } from './entities/professor.entity';
import { ProfessorRepository } from './professor.repository';

@Injectable()
export class ProfessorsService {
  constructor( private readonly professorRepo: ProfessorRepository ){}
  
  
  async create(createProfessorDto: CreateProfessorDto): Promise<Professor  | undefined> {
    const email: string = createProfessorDto.email;

    const professor: Professor = await this.professorRepo.findOne({
      where: { email },
    });

    if (professor != null)
      throw new HttpException(`Professor with email ${email} already exists`, HttpStatus.BAD_REQUEST);

    const newProfessor = this.professorRepo.create({
      name: createProfessorDto.name,
      sex: createProfessorDto.sex,
      email: createProfessorDto.email,
      photoPath: createProfessorDto.photoPath,
      description: createProfessorDto.description,
      facomPageUrl: createProfessorDto.facomPageUrl
    })
    this.professorRepo.save(newProfessor);
    
    return newProfessor;
  }

  async list(): Promise<Professor[]> {
    return this.professorRepo.find();
  }

  async findOne(id: number) {
    return await this.professorRepo.findOne({
      where: {id}
    });
  }

  async update(
    id: number, 
    updateProfessorDto: UpdateProfessorDto): Promise<Professor> | undefined {
      
      const professor = await this.professorRepo.findOne({
        where: { id },
      });

      const email = updateProfessorDto.email;

      if (professor == null) throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      
      professor.name = updateProfessorDto.name;
	    professor.sex = updateProfessorDto.sex;
      professor.description = updateProfessorDto.description;
      professor.facomPageUrl = updateProfessorDto.facomPageUrl;
      professor.photoPath = updateProfessorDto.photoPath;

      await this.professorRepo.update({ email }, professor);
      this.professorRepo.save(professor);

      return professor;      
  }

  async remove(id: number): Promise<string> {
    const professor = await this.professorRepo.findOne({
      where: {id},
    });
    if (professor == null) throw new HttpException("Professor not found", HttpStatus.NOT_FOUND);
    
    this.professorRepo.delete(professor);
    // this.professorRepo.save(professor);
    return `Deleted Successfully`;
  }
}
