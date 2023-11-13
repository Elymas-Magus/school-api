import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseRequestResult } from "@app/common/BaseModels/base-Request-Result.dto";
import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { CreateMediaDto } from "@app/media/dto/create-media.dto";
import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { AddNewMediasToResourceDto } from "./dto/add-medias.dto";
import { CreateResourceMediaDto } from "./dto/create-resource-media.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceFilter } from "./dto/resource-filter.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { Resource } from "./entities/resource.entity";
import { ResourcesController } from "./resources.controller";
import { ResourcesService } from "./resources.service";

describe("ResourcesController", () => {
  let resourcesController: ResourcesController;

  const resourcesService = {
    findOne: jest.fn(),
    findAllPaginated: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    addNewMedias: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [
        {
          provide: ResourcesService,
          useValue: resourcesService,
        },
      ],
    }).compile();

    resourcesController = module.get<ResourcesController>(ResourcesController);
  });

  it("should be defined", () => {
    expect(resourcesController).toBeDefined();
  });

  it("should return paginated resources", async () => {
    //Arrange
    const mockFilters: ResourceFilter = {
      creatorId: 1,
      description: "desc",
      subjectId: 1,
      title: "title",
    };

    const mockParams: BaseListiningRequest<ResourceFilter> = {
      orderBy: "id",
      orderDirection: "ASC",
      page: 1,
      per_page: 10,
      filters: mockFilters,
    };

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

    const mockResult: BaseListiningRequestResult<Resource> = {
      data: dataMockResult,
      page: 1,
      per_page: 10,
      num_pages: 1,
      next_page: false,
      prev_page: false,
    };

    jest
      .spyOn(resourcesService, "findAllPaginated")
      .mockResolvedValueOnce(mockResult);

    //Act
    const result = await resourcesController.listPaginated(
      mockParams.orderBy,
      mockParams.orderDirection,
      mockParams.page,
      mockParams.per_page,
      mockParams.filters
    );

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        mockResult
      )
    );
    expect(resourcesService.findAllPaginated).toHaveBeenCalledWith(mockParams);
  });

  it("should return list of all resources", async () => {
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
      .spyOn(resourcesService, "findAll")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await resourcesController.list();

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        dataMockResult
      )
    );
  });

  it("should return resource by id", async () => {
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

    jest
      .spyOn(resourcesService, "findOne")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await resourcesController.findOne("1");

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        dataMockResult
      )
    );
  });

  it("should delete resource by id", async () => {
    //Arrange
    jest.spyOn(resourcesService, "remove").mockResolvedValueOnce("success");

    //Act
    const result = await resourcesController.remove("1");

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted)
    );
  });

  it("should create a resource", async () => {
    //Arrange
    const mediasCreateResource: Array<CreateResourceMediaDto> = [
      {
        collection_name: "teste",
        metadata: {
          name: "string",
          height: "5",
          size: 222,
          width: "20",
        },
        filename: "arquivo-teste.jpg",
        mime_type: "image",
        action: "act",
      },
      {
        collection_name: "teste2",
        metadata: {
          name: "string2",
          height: "5",
          size: 222,
          width: "20",
        },
        filename: "arquivo-teste2.jpg",
        mime_type: "image",
        action: "act",
      },
    ];

    const createResource: CreateResourceDto = {
      title: "title",
      description: "desc",
      creatorId: 1,
      subjectId: 1,
      medias: mediasCreateResource,
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

    jest
      .spyOn(resourcesService, "create")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await resourcesController.create(
      {
        user: {
          id: 1,
        },
      },
      createResource
    );

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.CREATED,
        BaseRequestMessages.Created,
        dataMockResult
      )
    );
  });

  it("should edit a resource", async () => {
    //Arrange
    const updateResource: UpdateResourceDto = {
      title: "title",
      description: "desc",
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

    jest
      .spyOn(resourcesService, "update")
      .mockResolvedValueOnce(dataMockResult);

    //Act
    const result = await resourcesController.update("1", updateResource);

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Updated,
        dataMockResult
      )
    );
  });

  it("should add medias to resource", async () => {
    //Arrange
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

    jest
      .spyOn(resourcesService, "addNewMedias")
      .mockResolvedValueOnce(BaseRequestMessages.Success);

    //Act
    const result = await resourcesController.addNewMedias("1", updateResource);

    //Assert
    expect(result).toEqual(
      new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Success)
    );
  });
});
