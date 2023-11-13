import { RoleHasPermissionsService } from "@app/role_has_permissions/role_has_permissions.service";
import { faker } from "@faker-js/faker";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Sex } from "./enums/sex_enum";
import { UserRepository } from "./users.repository";
import { UsersService } from "./users.service";
declare const global: any;

describe("UsersService", () => {
  let service: UsersService;

  const userRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
  };

  const roleHasPermissionService = {
    authorize: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: userRepository,
        },
        {
          provide: RoleHasPermissionsService,
          useValue: roleHasPermissionService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("list => should return a list of users", async () => {
    //Arrange
    const users = generateUserModelList(faker.number.int({ min: 1, max: 10 }));

    jest.spyOn(userRepository, "find").mockReturnValue(users);
    //Act
    const result = await service.list();

    //Assert
    expect(result).toEqual(users);
  });

  it("findById => should return an user", async () => {
    //Arrange
    const user = generateUserModel();

    jest.spyOn(userRepository, "findOne").mockReturnValue(user);
    //Act
    const result = await service.findById(1);

    //Assert
    expect(result).toEqual(user);
  });

  it("findById => should return not found error", async () => {
    //Arrange
    jest.spyOn(userRepository, "findOne").mockReturnValue(null);

    //Act
    //Assert
    await expect(
      service.findById(faker.number.int({ min: 0, max: 5 }))
    ).rejects.toThrowError(
      new HttpException("User not found", HttpStatus.NOT_FOUND)
    );
  });

  it("delete => should delete an user", async () => {
    //Arrange
    const user = generateUserModel();

    jest.spyOn(userRepository, "findOne").mockReturnValue(user);
    jest.spyOn(userRepository, "delete").mockReturnValue(null);
    jest.spyOn(userRepository, "save").mockReturnValue(null);

    //Act
    const result = await service.remove(1);

    //Assert
    expect(result).toEqual("Deleted Successfully");
  });

  it("delete => should return a not found error", async () => {
    //Arrange
    jest.spyOn(userRepository, "findOne").mockReturnValue(null);
    //Act
    //Assert
    await expect(
      service.remove(faker.number.int({ min: 0, max: 5 }))
    ).rejects.toThrowError(
      new HttpException("User not found", HttpStatus.NOT_FOUND)
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

    jest.spyOn(userRepository, "findOne").mockReturnValue(user);
    jest.spyOn(userRepository, "update").mockReturnValue(user);

    //Act
    const result = await service.update(user.id, updateUser);

    //Assert
    expect(result).toEqual(user);
  });

  it("update => should return not found error", async () => {
    //Arrange
    const updateUser: UpdateUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      sex: Sex.Male,
      password: faker.string.alpha(40),
      ufuRegister:
        faker.number.int({ min: 10000, max: 99999 }).toString() +
        "BSI" +
        faker.number.int({ min: 100, max: 999 }),
    };

    jest.spyOn(userRepository, "findOne").mockReturnValue(null);
    jest.spyOn(userRepository, "update").mockReturnValue(null);

    //Act
    //Assert
    await expect(
      service.update(faker.number.int({ min: 0, max: 5 }), updateUser)
    ).rejects.toThrowError(
      new HttpException("User not found", HttpStatus.NOT_FOUND)
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

    jest.spyOn(userRepository, "createQueryBuilder").mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis().mockReturnValue(null),
    } as any);

    jest.spyOn(userRepository, "create").mockReturnValue(user);
    jest.spyOn(userRepository, "save").mockReturnValue(user);

    //Act
    const result = await service.create(createUser);

    //Assert
    expect(result.register_number === createUser.ufuRegister).toBeTruthy();
  });

  it("create => should return a bad request - email empty", async () => {
    //Arrange
    const user = generateUserModel();

    const createUser: CreateUserDto = {
      email: null,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: Sex.Male,
      password: user.password,
      ufuRegister: user.register_number,
    };

    //Act
    //Assert
    await expect(service.create(createUser)).rejects.toThrowError(
      new HttpException(`Email can't be empty`, HttpStatus.BAD_REQUEST)
    );
  });

  it("create => should return a bad request - sex empty", async () => {
    //Arrange
    const user = generateUserModel();

    const createUser: CreateUserDto = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: null,
      password: user.password,
      ufuRegister: user.register_number,
    };

    //Act
    //Assert
    await expect(service.create(createUser)).rejects.toThrowError(
      new HttpException(`Sex can't be empty`, HttpStatus.BAD_REQUEST)
    );
  });

  it("create => should return a bad request - password empty", async () => {
    //Arrange
    const user = generateUserModel();

    const createUser: CreateUserDto = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      sex: Sex.Male,
      password: null,
      ufuRegister: user.register_number,
    };

    //Act
    //Assert
    await expect(service.create(createUser)).rejects.toThrowError(
      new HttpException(`Password can't be empty`, HttpStatus.BAD_REQUEST)
    );
  });

  it("create => should return a bad request - AlreadyExist - Email", async () => {
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

    jest.spyOn(userRepository, "createQueryBuilder").mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis().mockReturnValue(user),
    } as any);

    //Act
    //Assert
    await expect(service.create(createUser)).rejects.toThrowError(
      new HttpException(
        `User with email ${createUser.email} already exists`,
        HttpStatus.BAD_REQUEST
      )
    );
  });

  it("create => should return a bad request - AlreadyExist - Email", async () => {
    //Arrange
    const user = generateUserModel();

    const createUser: CreateUserDto = {
      email: faker.internet.email({ provider: "gmail" }),
      firstName: user.firstName,
      lastName: user.lastName,
      sex: Sex.Male,
      password: user.password,
      ufuRegister: user.register_number,
    };

    jest.spyOn(userRepository, "createQueryBuilder").mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orWhere: jest.fn().mockReturnThis(),
      withDeleted: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockReturnThis().mockReturnValue(user),
    } as any);

    //Act
    //Assert
    await expect(service.create(createUser)).rejects.toThrowError(
      new HttpException(
        `User with register ${createUser.ufuRegister} already exists`,
        HttpStatus.BAD_REQUEST
      )
    );
  });
});
