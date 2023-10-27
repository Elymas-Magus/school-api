import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorController } from './professor.controller';
import { ProfessorsService } from './professor.service';
import { BaseRequestMessages } from '@app/common/BaseModels/BaseEnums/base-request-messages.enum';
import { BaseRequestResult } from '@app/common/BaseModels/base-Request-Result.dto';
import { HttpStatus } from '@nestjs/common';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { Professor } from './entities/professor.entity';


describe('ProfessorController', () => {
  let professorController: ProfessorController;

  const mockProfessorsService = {
    create: jest.fn(),
    findll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
      providers: [
        {
          provide: ProfessorsService,
          useValue: mockProfessorsService,
        },
      ],
    }).compile();

    professorController = module.get<ProfessorController>(ProfessorController);
  });

  it('Professor Controller should be defined', () => {
    expect(professorController).toBeDefined();
  });

  it('create => should create a professor', async () => {
    // arrange
    const createProfessorDto = {
      name: 'Gustavo',
      sex: 'Masculino',
      email:'gustavo@teste.com',
      photoPath: 'teste-de-url',
      description: 'descrição',
      facomPageUrl:'teste-de-url-da-facom'
    } as CreateProfessorDto;

    const professor = {
      id: Date.now(),
      name: 'Gustavo',
      sex: 'Masculino',
      email:'gustavo@teste.com',
      photoPath: 'teste-de-url',
      description: 'descrição',
      facomPageUrl:'teste-de-url-da-facom',
    } as Professor;

    const mockBaseRequestCreatedResult = {
      status_code: HttpStatus.CREATED,
      message: BaseRequestMessages.Created,
      data: professor,
    } as BaseRequestResult;
    
    jest.spyOn(mockProfessorsService, 'create').mockReturnValue(professor);

    // act
    const result = await professorController.create(createProfessorDto);
    // assert
    expect(mockProfessorsService.create).toBeCalled();
    expect(mockProfessorsService.create).toBeCalledWith(createProfessorDto);
    expect(result).toEqual(mockBaseRequestCreatedResult);

  });

  // it('should update a professor', () => {
  //   const updateProfessorDto = {
  //     name: 'Gustavo',
  //     sex: 'Masculino',
  //     email:'gustavo@teste.com',
  //     photoPath: 'teste-de-url',
  //     description: 'descrição',
  //     facomPageUrl:'teste-de-url-da-facom'
  //   };

  //   expect.contro
  // });

});
