import { faker } from "@faker-js/faker";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ListSubjectsByPeriod } from "./dto/list-subjects-by-period.dto";
import { Subject } from "./entities/subject.entity";
import { SubjectRepository } from "./subject.repository";
import { SubjectService } from "./subject.service";

describe("SubjectService", () => {
  let subjectService: SubjectService;

  const subjectRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findBy: jest.fn(),
    delete: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubjectService,
        {
          provide: SubjectRepository,
          useValue: subjectRepository,
        },
      ],
    }).compile();

    subjectService = module.get<SubjectService>(SubjectService);
  });

  it("should be defined", () => {
    expect(subjectService).toBeDefined();
  });

  const createSubjectMock = () => {
    return {
      id: faker.number.int({ min: 0, max: 1000 }),
      name: "title",
      ch_total: faker.number.int({ min: 0, max: 1000 }),
      curriculum: faker.string.alpha(30),
      goal: faker.string.alpha(30),
      period: faker.number.int({ min: 0, max: 10 }),
      createdAt: faker.date.past(),
      deletedAt: null,
      updatedAt: null,
      resources: null,
    };
  };

  const createSubjectListMock = (quantity: number) => {
    const subjectList: Array<Subject> = [];

    for (let i = 0; i < quantity; i++) {
      subjectList.push({
        id: faker.number.int({ min: 0, max: 1000 }),
        name: "title",
        ch_total: faker.number.int({ min: 0, max: 1000 }),
        curriculum: faker.string.alpha(30),
        goal: faker.string.alpha(30),
        period: faker.number.int({ min: 0, max: 10 }),
        createdAt: faker.date.past(),
        deletedAt: null,
        updatedAt: null,
        resources: null,
      });
    }

    return subjectList;
  };

  const createSubjectDtoMock = () => {
    return {
      name: "title",
      ch_total: faker.number.int({ min: 0, max: 1000 }),
      curriculum: faker.string.alpha(30),
      goal: faker.string.alpha(30),
      period: faker.number.int({ min: 0, max: 10 }),
    };
  };

  it("findAll => should return list of all subjects", async () => {
    //Arrange
    const dataMockResult = createSubjectListMock(2);

    jest.spyOn(subjectRepository, "find").mockReturnValue(dataMockResult);

    //Act
    const result = await subjectService.findAll();

    //Assert
    expect(result).toEqual(dataMockResult);
  });

  it("findOne => should return a subject by id", async () => {
    //Arrange
    const dataMockResult = createSubjectMock();

    jest
      .spyOn(subjectRepository, "findOne")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await subjectService.findOne(
      faker.number.int({ min: 0, max: 5 })
    );

    //Assert
    expect(result).toEqual(dataMockResult);
  });

  it("findOne => should return not found error", async () => {
    //Arrange

    jest.spyOn(subjectRepository, "findOne").mockResolvedValueOnce(null);

    //Act
    //Assert
    await expect(
      subjectService.findOne(faker.number.int({ min: 0, max: 5 }))
    ).rejects.toThrowError(
      new HttpException("Subject not found", HttpStatus.NOT_FOUND)
    );
  });

  it("remove => should delete a subject by id", async () => {
    //Arrange
    const dataMockResult = createSubjectMock();

    jest
      .spyOn(subjectRepository, "findOne")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await subjectService.remove(
      faker.number.int({ min: 0, max: 5 })
    );

    //Assert
    expect(result).toEqual("Deleted Successfully");
  });

  it("remove => should delete a subject by id", async () => {
    //Arrange
    jest.spyOn(subjectRepository, "findOne").mockResolvedValueOnce(null);

    //Act
    //Assert
    await expect(
      subjectService.remove(faker.number.int({ min: 0, max: 5 }))
    ).rejects.toThrowError(
      new HttpException("Subject not found", HttpStatus.NOT_FOUND)
    );
  });

  it("findByPeriod => should return list of subjects of a period", async () => {
    //Arrange
    const dataMockResult = createSubjectListMock(2);

    jest.spyOn(subjectRepository, "findBy").mockReturnValue(dataMockResult);
    const period = faker.number.int({ min: 0, max: 10 });
    //Act
    const result = await subjectService.findByPeriod(period);

    //Assert
    expect(result).toEqual(dataMockResult);
  });

  it("findByPeriod => should return error not found", async () => {
    //Arrange
    jest.spyOn(subjectRepository, "findBy").mockReturnValue(null);

    //Act
    //Assert
    await expect(
      subjectService.findByPeriod(faker.number.int({ min: 0, max: 5 }))
    ).rejects.toThrowError(
      new HttpException("Subject not found", HttpStatus.NOT_FOUND)
    );
  });

  it("findGroupedByPeriod => should return list of subjects by period", async () => {
    //Arrange
    const dataMockResult = createSubjectListMock(10);

    const subjectByPeriodList: Array<ListSubjectsByPeriod> = [];

    for (let i = 1; i < faker.number.int({ min: 6, max: 11 }); i++) {
      const subjectTemp = createSubjectListMock(2);
      subjectByPeriodList.push(new ListSubjectsByPeriod(i, subjectTemp));
    }

    jest.spyOn(subjectRepository, "find").mockReturnValue(dataMockResult);

    //Act
    const result = await subjectService.findAndGroupByPeriod();

    //Assert
    expect(result).toEqual(subjectByPeriodList);
  });
});
