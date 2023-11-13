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
    list: jest.fn(),
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

  it("list => shoud list all professors in the database", async () => {
    // arrange
    const professors = [{
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
    }] as Professor[];

    const mockBaseRequestFoundResult = {
      status_code: HttpStatus.OK,
      message: BaseRequestMessages.Found,
      data: professors,
    } as BaseRequestResult;

    jest.spyOn(mockProfessorsService, 'list').mockReturnValue(professors);

    //act 
    const result = await professorController.list();

    // assert 
    expect(mockProfessorsService.list).toBeCalled();
    expect(result).toEqual(mockBaseRequestFoundResult);
  });

  it("remove => should delete a professor", async () => {
    // arrange 
    const professorId = "1";



    const mockBaseRequestDeletedResult = {
      status_code: HttpStatus.OK,
      message: BaseRequestMessages.Deleted,
      data: null,
    } as BaseRequestResult;

    jest.spyOn(mockProfessorsService, 'remove').mockReturnValue("Deleted Successfully");

    // act
    const result = await professorController.remove(professorId);

    // assert
    expect(mockProfessorsService.remove).toBeCalled();
    expect(mockProfessorsService.remove).toBeCalledWith(Number(professorId));
    expect(result).toEqual(mockBaseRequestDeletedResult);
  });

});
