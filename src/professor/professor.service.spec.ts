import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsService } from './professor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { ProfessorRepository } from './professor.repository';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import exp from 'constants';

describe('ProfessorService', () => {
  let service: ProfessorsService;

  const mockProfessorRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfessorsService, {
        provide: getRepositoryToken(ProfessorRepository),
        useValue: mockProfessorRepository,
      },
      ],
    }).compile();

    service = module.get<ProfessorsService>(ProfessorsService);
  });

  it('Professor Service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create => should create a new professor record and return its data', async () => {
    const createProfessorDto = {
      name: 'Gustavo',
      sex: 'Masculino',
      email: 'gustavo@teste.com',
      photoPath: 'teste-de-url',
      description: 'descrição 2',
      facomPageUrl: 'teste-de-url-da-facom',
    } as CreateProfessorDto;


    const professor = {
      name: 'Gustavo',
      sex: 'Masculino',
      email: 'gustavo@teste.com',
      photoPath: 'teste-de-url',
      description: 'descrição 2',
      facomPageUrl: 'teste-de-url-da-facom',
    } as Professor;

    jest.spyOn(mockProfessorRepository, 'create').mockReturnValue(professor);
    jest.spyOn(mockProfessorRepository, 'save').mockReturnValue(professor);

    const result = await service.create(createProfessorDto);

    expect(mockProfessorRepository.create).toBeCalled();
    expect(mockProfessorRepository.save).toBeCalled();
    expect(mockProfessorRepository.save).toBeCalledWith(createProfessorDto);
    expect(result).toEqual(professor);
  });

  it('create fail => professor already exits', async () => {
    const mockedExistedEmail = "gustavo@teste.com"
    const createProfessorDto = {
      name: 'Gustavo',
      sex: 'Masculino',
      email: 'gustavo@teste.com',
      photoPath: 'teste-de-url',
      description: 'descrição 2',
      facomPageUrl: 'teste-de-url-da-facom',
    } as CreateProfessorDto;

    if(createProfessorDto.email == mockedExistedEmail) {
      jest.spyOn(mockProfessorRepository, 'findOne').mockReturnValue(new HttpException(
        `Professor with email ${createProfessorDto.email} already exists`, HttpStatus.BAD_REQUEST)); 
    }
    try {
      await service.create(createProfessorDto);
    }
    catch (err) {
      expect(err.status).toBe(400);
      expect(err.message).toContain(`Professor with email ${createProfessorDto.email} already exists`);
      
    }
  });

  it('findAll => should return an array of professor', async () => {
    // arrange
    const professor = {
      id: Date.now(),
      name: 'Gustavo',
      sex: 'Masculino',
      email: 'gustavo@teste.com',
      photoPath: 'teste-de-url',
      description: 'descrição 2',
      facomPageUrl: 'teste-de-url-da-facom',
    };
    const professors = [professor];
    jest.spyOn(mockProfessorRepository, 'find').mockResolvedValue(professors);

    //act
    const result = await service.list();

    // assert
    
    expect(mockProfessorRepository.find).toBeCalled();
    expect(result).toEqual(professors);
  });

  
  it('remove => should find a professor by a given id and then remove it', async () => {
    // arrange
    const professorId = 1;
    const professor = {
      id: 1,
      name: 'Pedro Frosi Rosa',
      sex: 'Masculino',
      email: 'pfrosi@ufu.br',
      photoPath: 'caminho-do-bucket-para-foto',
      description: `Possui mestrado em Engenharia de Computação pela Escola Politécnica da Universidade de São Paulo (1990) 
      na área de Arquitetura de Redes de Computadores e doutorado em Engenharia de Computação por um acordo de cooperação 
      internacional entre Escola Politécnica da Universidade de São Paulo e o Centre National de la Recherche Scientifique 
      (CNRS-France 1995) na área de sistemas distribuídos no Laboratoire d'Analyse et d'Architecture des Systemes (LAAS)/Toulouse.`,
      facomPageUrl: 'https://facom.ufu.br/pessoas/docentes/pedro-frosi-rosa',
    } as Professor;

    jest.spyOn(mockProfessorRepository, 'findOne').mockReturnValue(professor);

    //act
    const result = await service.remove(professorId);

    // assert
    expect(mockProfessorRepository.findOne).toBeCalled();
    expect(mockProfessorRepository.delete).toBeCalled();
    expect(mockProfessorRepository.delete).toBeCalledWith(professor);
    expect(result).toEqual("Deleted Successfully");

  });

});
