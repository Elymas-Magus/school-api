import { Test, TestingModule } from '@nestjs/testing';
import { ProfessorsService } from './professor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Professor } from './entities/professor.entity';
import { ProfessorRepository } from './professor.repository';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

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
  })

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
    expect(result).toEqual(professors);
    expect(mockProfessorRepository.find).toBeCalled();

  });

  
  // it('findOne => should find a user by a given id and return its data', async () => {
  //   // arrange
  //   const id = 1;
    const professor = {
      id: 1,
      name: 'Rodrigo Miani',
      sex: 'Masculino',
      email: 'miani@ufu.br',
      photoPath: 'caminho-do-bucket-para-foto',
      description: `Possui graduação em Matemática pela Universidade Federal de São Carlos (2005),
      mestrado em Engenharia Elétrica pela Universidade Estadual de Campinas (2009) 
      e doutorado em Engenharia Elétrica pela Universidade Estadual de Campinas (2013).`,
      facomPageUrl: 'https://facom.ufu.br/pessoas/docentes/rodrigo-sanches-miani'
    };
  //   jest.spyOn(mockProfessorRepository, 'findOne').mockReturnValue(professor);

  //   // act
  //   const result = await service.findOne(id);

  //   // assert
  //   expect(result).toEqual(professor);
  //   expect(mockProfessorRepository.findOne).toBeCalled();
  //   expect(mockProfessorRepository.findOne).toBeCalledWith({where: {id}});
  // });


  // it('update => should find a user by a given id and update its data', async () => {
  //   // arrange
  //   const id = 1;
  //   // const professor = {
  //   //   id: 1,
  //   //   name: 'Rodrigo Miani',
  //   //   sex: 'Masculino',
  //   //   email: 'miani@ufu.br',
  //   //   photoPath: 'caminho-do-bucket-para-foto',
  //   //   description: `Possui graduação em Matemática pela Universidade Federal de São Carlos (2005),
  //   //   mestrado em Engenharia Elétrica pela Universidade Estadual de Campinas (2009) 
  //   //   e doutorado em Engenharia Elétrica pela Universidade Estadual de Campinas (2013).`,
  //   //   facomPageUrl: 'https://facom.ufu.br/pessoas/docentes/rodrigo-sanches-miani'
  //   // } as Professor;
  //   const professor = new Professor();
  //   professor.id = 1;
  //   professor.name = "Rodrigo Miani";
  //   professor.sex = "Masculino";
  //   professor.email = "miani@ufu.br";
  //   professor.photoPath = "caminho-da-foto-do-bucket";
  //   professor.description = `Possui graduação em Matemática pela Universidade Federal de São Carlos (2005),
  //   mestrado em Engenharia Elétrica pela Universidade Estadual de Campinas (2009) 
  //   e doutorado em Engenharia Elétrica pela Universidade Estadual de Campinas (2013).`;
  //   professor.facomPageUrl = "https://facom.ufu.br/pessoas/docentes/rodrigo-sanches-miani";

  //   // const updateProfessorDto = {
  //   //   name: 'Rodrigo Miani',
  //   //   sex: 'Masculino',
  //   //   email: 'miani@ufu.br',
  //   //   photoPath: 'caminho-do-bucket-para-foto',
  //   //   description: `Possui graduação em Matemática pela Universidade Federal de São Carlos (2005),
  //   //   mestrado em Engenharia Elétrica pela Universidade Estadual de Campinas (2009) 
  //   //   e doutorado em Engenharia Elétrica pela Universidade Estadual de Campinas (2013).`,
  //   //   facomPageUrl: 'https://facom.ufu.br/pessoas/docentes/rodrigo-sanches-miani'
  //   // } as UpdateProfessorDto;
  //   const updateProfessorDto = new UpdateProfessorDto();
  //   updateProfessorDto.name = "Rodrigo Miani";
  //   updateProfessorDto.sex = "Masculino";
  //   updateProfessorDto.email = "miani@ufu.br";
  //   updateProfessorDto.photoPath = "caminho-da-foto-do-bucket";
  //   updateProfessorDto.description = `Possui graduação em Matemática pela Universidade Federal de São Carlos (2005),
  //   mestrado em Engenharia Elétrica pela Universidade Estadual de Campinas (2009) 
  //   e doutorado em Engenharia Elétrica pela Universidade Estadual de Campinas (2013).`;
  //   updateProfessorDto.facomPageUrl = "https://facom.ufu.br/pessoas/docentes/rodrigo-sanches-miani";
    

  //   // jest.spyOn(mockProfessorRepository, 'findOne').mockReturnValue(professor);
  //   jest.spyOn(mockProfessorRepository, 'update').mockReturnValue(professor);

  //   // act
  //   // const result = await service.findOne(id);
  //   const result = await service.update(id, updateProfessorDto);

  //   // assert 
  //   expect(result).toEqual(professor);
  //   expect(mockProfessorRepository.update).toBeCalled();
  //   // expect(mockProfessorRepository.update).toBeCalledWith(professor);

  // });
  // it('remove => should find a professor by a given id and the remove ', async () => {
  //   // arrange
  //   const id: number = 1;
  //   const professor: Professor = {
  //     id: 1,
  //     name: 'Gustavo',
  //     sex: 'Masculino',
  //     email: 'gustavo@teste.com',
  //     photoPath: 'teste-de-url',
  //     description: 'descrição 2',
  //     facomPageUrl: 'teste-de-url-da-facom',
  //   };
  //   jest.spyOn(mockProfessorRepository, 'delete').mockReturnValue(professor);

  //   //act
  //   const result = await service.remove(id);
  //   if (result == null) {
  //     console.log("Teste falhou");
  //   }

  //   expect(result).toEqual(professor);
  //   expect(mockProfessorRepository.delete).toBeCalled();
  //   expect(mockProfessorRepository.delete).toBeCalledWith(id);

  // });

});
