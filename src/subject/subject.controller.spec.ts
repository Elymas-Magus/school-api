import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseRequestResult } from "@app/common/BaseModels/base-Request-Result.dto";
import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Subject } from "./entities/subject.entity";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";

describe("SubjectController", () => {
  let subjectController: SubjectController;

  const subjectService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectController],
      providers: [
        {
          provide: SubjectService,
          useValue: subjectService,
        },
      ],
    }).compile();

    subjectController = module.get<SubjectController>(SubjectController);
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

  it("should be defined", () => {
    expect(subjectController).toBeDefined();
  });

  it("findAll => should return list of all subjects", async () => {
    //Arrange
    const dataMockResult = createSubjectListMock(2);

    jest.spyOn(subjectService, "findAll").mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await subjectController.findAll();

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        dataMockResult
      )
    );
  });

  it("findOne => should return a subject by id", async () => {
    //Arrange
    const dataMockResult = createSubjectMock();

    jest.spyOn(subjectService, "findOne").mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await subjectController.findOne(faker.string.numeric());

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        dataMockResult
      )
    );
  });

  it("remove => should delete a subject by id", async () => {
    //Arrange
    jest
      .spyOn(subjectService, "remove")
      .mockResolvedValueOnce(faker.string.alpha(10));

    //Act
    const result = await subjectController.remove(faker.string.numeric());

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted)
    );
  });
});
