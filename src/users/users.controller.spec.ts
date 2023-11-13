import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseRequestResult } from "@app/common/BaseModels/base-Request-Result.dto";
import { faker } from "@faker-js/faker";
import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Sex } from "./enums/sex_enum";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

describe("UsersController", () => {
  let controller: UsersController;

  const userService = {
    create: jest.fn(),
    list: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: userService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  const generateUserModel = (): User => {
    const user: User = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      id: faker.number.int({ min: 1, max: 1000 }),
      password: faker.string.alpha(40),
      createdAt: faker.date.past(),
      deletedAt: null,
      activated: true,
      forbidden: false,
      register_number:
        faker.number.int({ min: 10000, max: 99999 }).toString() +
        "BSI" +
        faker.number.int({ min: 100, max: 999 }),
      sex: faker.person.sex(),
      updatedAt: faker.date.past(),
      lastLoginAt: faker.date.past(),
      modelHasRoles: null,
      resources: null,
    };

    return user;
  };

  const generateUserModelList = (quantity: number): Array<User> => {
    const users: Array<User> = [];

    for (let i = 0; i < quantity; i++) {
      users.push({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.number.int({ min: 1, max: 1000 }),
        password: faker.string.alpha(40),
        createdAt: faker.date.past(),
        deletedAt: null,
        activated: true,
        forbidden: false,
        register_number:
          faker.number.int({ min: 10000, max: 99999 }).toString() +
          "BSI" +
          faker.number.int({ min: 100, max: 999 }),
        sex: faker.person.sex(),
        updatedAt: faker.date.past(),
        lastLoginAt: faker.date.past(),
        modelHasRoles: null,
        resources: null,
      });
    }
    return users;
  };

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("list => should return a list of users", async () => {
    //Arrange
    const users = generateUserModelList(faker.number.int({ min: 1, max: 10 }));

    jest.spyOn(userService, "list").mockReturnValue(users);
    //Act
    const result = await controller.list();

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Found, users)
    );
  });

  it("find(ById) => should return an user", async () => {
    //Arrange
    const user = generateUserModel();

    jest.spyOn(userService, "findById").mockReturnValue(user);
    //Act
    const result = await controller.find("1");

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Found, user)
    );
  });

  it("delete => should delete an user", async () => {
    //Arrange
    const user = generateUserModel();

    jest.spyOn(userService, "findById").mockReturnValue(user);
    jest.spyOn(userService, "remove").mockReturnValue(null);
    //Act
    const result = await controller.remove("1");

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted)
    );
  });

  it("update => should update an user", async () => {
    //Arrange
    const user = generateUserModel();

    const updateUser: UpdateUserDto = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: Sex.Male,
      password: user.password,
      ufuRegister: user.register_number,
    };
    jest.spyOn(userService, "update").mockReturnValue(user);

    //Act
    const result = await controller.update("1", updateUser);

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Updated, user)
    );
  });

  it("create => should create an user", async () => {
    //Arrange
    const user = generateUserModel();

    const createUser: CreateUserDto = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: Sex.Male,
      password: user.password,
      ufuRegister: user.register_number,
    };

    jest.spyOn(userService, "create").mockReturnValue(user);

    //Act
    const result = await controller.create(createUser);

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.CREATED,
        BaseRequestMessages.Created,
        user
      )
    );
  });
});
