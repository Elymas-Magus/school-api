import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { CreateMediaDto } from "@app/media/dto/create-media.dto";
import { Media } from "@app/media/entities/media.entity";
import { MediaService } from "@app/media/media.service";
import { SubjectService } from "@app/subject/subject.service";
import { UsersService } from "@app/users/users.service";
import { faker } from "@faker-js/faker";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AddNewMediasToResourceDto } from "./dto/add-medias.dto";
import { ResourceFilter } from "./dto/resource-filter.dto";
import { Resource } from "./entities/resource.entity";
import { ResourceRepository } from "./resources.repository";
import { ResourcesService } from "./resources.service";

describe("ResourcesService", () => {
  let resourcesService: ResourcesService;

  const resourceRepository = {
    find: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
  };

  const usersService = {
    findById: jest.fn(),
  };

  const mediaService = {
    create: jest.fn(),
    gets3MediaUrl: jest.fn(),
  };

  const subjectService = {
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourcesService,
        {
          provide: ResourceRepository,
          useValue: resourceRepository,
        },
        {
          provide: ResourceRepository,
          useValue: resourceRepository,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: MediaService,
          useValue: mediaService,
        },
        {
          provide: SubjectService,
          useValue: subjectService,
        },
      ],
    }).compile();

    resourcesService = module.get<ResourcesService>(ResourcesService);
  });

  it("should be defined", () => {
    expect(resourcesService).toBeDefined();
  });

  // it("should create a new resource with medias", async () => {
  //   //Arrange
  //   const createResourceDto: CreateResourceDto = {
  //     title: "Test Resource",
  //     description: "Test Description",
  //     subjectId: 1,
  //     creatorId: 1,
  //     medias: [
  //       {
  //         collection_name: "images",
  //         mime_type: "image/png",
  //         filename: "image1.png",
  //         action: faker.string.alpha(5),
  //         metadata: {
  //           height: faker.number.int({ min: 0, max: 50 }).toString(),
  //           size: faker.number.int({ min: 0, max: 50 }),
  //           name: faker.string.alpha(5),
  //           width: faker.number.int({ min: 0, max: 50 }).toString(),
  //         },
  //       },
  //       {
  //         collection_name: "images",
  //         mime_type: "image/png",
  //         filename: "image2.png",
  //         action: faker.string.alpha(5),
  //         metadata: {
  //           height: faker.number.int({ min: 0, max: 50 }).toString(),
  //           size: faker.number.int({ min: 0, max: 50 }),
  //           name: faker.string.alpha(5),
  //           width: faker.number.int({ min: 0, max: 50 }).toString(),
  //         },
  //       },
  //     ],
  //   };

  //   const mockMedia: Media = {
  //     id: 1,
  //     model_id: 1,
  //     model_type: "resource",
  //     collection_name: "teste",
  //     metadata: "{prop: value}",
  //     filename: "arquivo-teste.jpg",
  //     mime_type: "image",
  //     disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
  //     size: 222,
  //     url: "www.url.com.br/teste",
  //     createdAt: new Date(),
  //     deletedAt: null,
  //     updatedAt: null,
  //     resource: null,
  //   };

  //   const newResource = new Resource();
  //   newResource.id = 1;
  //   newResource.title = createResourceDto.title;
  //   newResource.description = createResourceDto.description;
  //   newResource.creatorId = createResourceDto.creatorId;
  //   newResource.activated = true;
  //   newResource.createdAt = new Date();

  //   const subject = new Subject();
  //   subject.id = 1;

  //   jest.spyOn(subjectService, "findOne").mockResolvedValueOnce(subject);

  //   const creator = new User();
  //   creator.id = 1;
  //   jest.spyOn(usersService, "findById").mockResolvedValueOnce(creator);

  //   jest.spyOn(resourceRepository, "create").mockReturnValueOnce(newResource);
  //   jest.spyOn(resourceRepository, "save").mockResolvedValueOnce(newResource);
  //   const createMediaSpy = jest
  //     .spyOn(mediaService, "create")
  //     .mockResolvedValueOnce(null);
  //   jest.spyOn(mediaService, "create").mockReturnValue(mockMedia);

  //   //Act
  //   const result = await resourcesService.create(createResourceDto);

  //   //Assert
  //   expect(result).toEqual(newResource);
  //   expect(subjectService.findOne).toHaveBeenCalledWith(
  //     createResourceDto.subjectId
  //   );
  //   expect(usersService.findById).toHaveBeenCalledWith(
  //     createResourceDto.creatorId
  //   );
  //   expect(resourceRepository.create).toHaveBeenCalledWith(newResource);
  //   expect(resourceRepository.save).toHaveBeenCalledWith(newResource);

  //   expect(createMediaSpy).toHaveBeenCalledWith(
  //     expect.objectContaining<CreateMediaDto>({
  //       model_type: "Resource",
  //       model_id: newResource.id,
  //       resourceId: newResource.id,
  //       metadata: JSON.stringify(createResourceDto.medias[0].metadata),
  //       collection_name: createResourceDto.medias[0].collection_name,
  //       mime_type: createResourceDto.medias[0].mime_type,
  //       filename: createResourceDto.medias[0].filename,
  //       size: createResourceDto.medias[0].metadata.size,
  //       disk: "s3",
  //     })
  //   );
  // });

  it("findAll => should return list of all resources", async () => {
    //Arrange
    const dataMockResult: Array<Resource> = [
      {
        id: 1,
        title: "title",
        description: "description",
        activated: true,
        creatorId: 1,
        subjectId: 1,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        creator: null,
        media: null,
        subject: null,
      },
      {
        id: 2,
        title: "title2",
        description: "description2",
        activated: true,
        creatorId: 1,
        subjectId: 2,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        creator: null,
        media: null,
        subject: null,
      },
    ];

    jest
      .spyOn(resourceRepository, "find")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await resourcesService.findAll();

    //Assert
    expect(result).toEqual(dataMockResult);
  });

  it("findAllPaginated => should return paginated resources list with filters", async () => {
    const params: BaseListiningRequest<ResourceFilter> = {
      orderBy: "id",
      orderDirection: "ASC",
      page: 1,
      per_page: 10,
      filters: {
        creatorId: 1,
        description: "desc",
        subjectId: 1,
        title: "title",
      },
    };

    const mockResourceList = [new Resource(), new Resource()];

    jest.spyOn(resourceRepository, "createQueryBuilder").mockReturnValueOnce({
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValueOnce(mockResourceList.length),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValueOnce(mockResourceList),
    } as any);

    const result = await resourcesService.findAllPaginated(params);

    expect(result).toBeInstanceOf(BaseListiningRequestResult);
    expect(result.data).toEqual(mockResourceList);
    expect(result.page).toBe(params.page);
    expect(result.per_page).toBe(params.per_page);
    expect(result.num_pages).toBe(
      Math.ceil(mockResourceList.length / params.per_page)
    );
    expect(result.next_page).toBe(false);
    expect(result.prev_page).toBe(false);
  });

  it("getById => should return resource by id", async () => {
    //Arrange
    const mockMedia: Media = {
      id: 1,
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste.jpg",
      mime_type: "image",
      disk: "s3",
      size: 222,
      url: "www.url.com.br/teste",
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
      resource: null,
    };

    const dataMockResult: Resource = {
      id: 1,
      title: "title",
      description: "description",
      activated: true,
      creatorId: 1,
      subjectId: 1,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      creator: null,
      media: [mockMedia],
      subject: null,
    };

    jest.spyOn(resourceRepository, "findOne").mockReturnValue(dataMockResult);

    jest
      .spyOn(mediaService, "gets3MediaUrl")
      .mockReturnValue(faker.internet.url());

    //Act
    const result = await resourcesService.findOne(1);

    //Assert
    expect(result).toEqual(dataMockResult);
  });

  it("findOne => should return not found error", async () => {
    //Arrange
    jest.spyOn(resourceRepository, "findOne").mockReturnValue(null);

    //Act
    //Assert
    await expect(resourcesService.findOne(1)).rejects.toThrowError(
      new HttpException("Resource not found", HttpStatus.NOT_FOUND)
    );
  });

  it("update => should edit resource by id", async () => {
    //Arrange
    const dataMockResult: Resource = {
      id: 1,
      title: "title",
      description: "description",
      activated: true,
      creatorId: 1,
      subjectId: 1,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      creator: null,
      media: null,
      subject: null,
    };

    jest.spyOn(resourceRepository, "findOne").mockReturnValue(dataMockResult);
    jest.spyOn(resourceRepository, "update").mockReturnValue(dataMockResult);
    jest.spyOn(resourceRepository, "save").mockReturnValue(dataMockResult);
    //Act
    const result = await resourcesService.update(1, {
      title: faker.string.alpha(5),
      description: faker.string.alpha(5),
    });

    //Assert
    expect(result).toEqual(dataMockResult);
  });

  it("update =>should return not found error", async () => {
    //Arrange
    jest.spyOn(resourceRepository, "findOne").mockReturnValue(null);

    //Act
    //Assert
    await expect(
      resourcesService.update(1, {
        title: faker.string.alpha(5),
        description: faker.string.alpha(5),
      })
    ).rejects.toThrowError(
      new HttpException("Resource not found", HttpStatus.NOT_FOUND)
    );
  });

  it("remove => should remove resource by id", async () => {
    //Arrange
    const mockMedia: Media = {
      id: 1,
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste.jpg",
      mime_type: "image",
      disk: "s3",
      size: 222,
      url: "www.url.com.br/teste",
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
      resource: null,
    };

    const dataMockResult: Resource = {
      id: 1,
      title: "title",
      description: "description",
      activated: true,
      creatorId: 1,
      subjectId: 1,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      creator: null,
      media: [mockMedia],
      subject: null,
    };

    jest.spyOn(resourceRepository, "findOne").mockReturnValue(dataMockResult);
    jest.spyOn(subjectService, "remove").mockReturnValue(faker.string.alpha(5));
    jest.spyOn(resourceRepository, "delete").mockReturnValue(dataMockResult);
    jest.spyOn(resourceRepository, "save").mockReturnValue(dataMockResult);
    //Act
    const result = await resourcesService.remove(1);

    //Assert
    expect(result).toEqual("Success");
  });

  it("remove =>should return not found error", async () => {
    //Arrange
    jest.spyOn(resourceRepository, "findOne").mockReturnValue(null);

    //Act
    //Assert
    await expect(resourcesService.remove(1)).rejects.toThrowError(
      new HttpException("Resource not found", HttpStatus.NOT_FOUND)
    );
  });

  it("addNewMedias => should add new media to resource", async () => {
    //Arrange
    const mockMedia: Media = {
      id: 1,
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste.jpg",
      mime_type: "image",
      disk: "s3",
      size: 222,
      url: "www.url.com.br/teste",
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
      resource: null,
    };

    const dataMockResult: Resource = {
      id: 1,
      title: "title",
      description: "description",
      activated: true,
      creatorId: 1,
      subjectId: 1,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      creator: null,
      media: null,
      subject: null,
    };

    const createMedias: Array<CreateMediaDto> = [
      {
        model_id: 1,
        model_type: "resource",
        collection_name: "teste",
        metadata: "{prop: value}",
        filename: "arquivo-teste.jpg",
        mime_type: "image",
        disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
        size: 222,
        resourceId: 1,
      },
    ];

    const updateResource: AddNewMediasToResourceDto = {
      media: createMedias,
    };

    jest.spyOn(resourceRepository, "findOne").mockReturnValue(dataMockResult);
    jest.spyOn(mediaService, "create").mockReturnValue(mockMedia);
    //Act
    const result = await resourcesService.addNewMedias(1, updateResource);

    //Assert
    expect(result).toEqual(BaseRequestMessages.Success);
  });

  it("addNewMedias =>should return not found error", async () => {
    //Arrange
    jest.spyOn(resourceRepository, "findOne").mockReturnValue(null);

    //Act
    //Assert
    await expect(
      resourcesService.addNewMedias(1, expect.any(AddNewMediasToResourceDto))
    ).rejects.toThrowError(
      new HttpException("Resource not found", HttpStatus.NOT_FOUND)
    );
  });
});
