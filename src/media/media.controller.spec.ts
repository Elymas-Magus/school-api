import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseRequestResult } from "@app/common/BaseModels/base-Request-Result.dto";
import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { HttpStatus } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { CreateMediaDto } from "./dto/create-media.dto";
import { MediaFilter } from "./dto/media-filter.dto";
import { Media } from "./entities/media.entity";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";

describe("MediaController", () => {
  let mediaController: MediaController;

  const mockMediaService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
    findAllPaginated: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MediaController],
      providers: [
        {
          provide: MediaService,
          useValue: mockMediaService,
        },
      ],
    }).compile();

    mediaController = module.get<MediaController>(MediaController);
  });

  it("should be defined", () => {
    expect(mediaController).toBeDefined();
  });

  it("getById => Should be a Media", async () => {
    //Arrange
    const mediaExpected: Media = {
      id: 1,
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste.jpg",
      mime_type: "image",
      disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
      size: 222,
      url: "www.url.com.br/teste",
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
      resource: null,
    };

    const mockBaseRequestResult: BaseRequestResult = {
      status_code: HttpStatus.OK,
      message: BaseRequestMessages.Found,
      data: mediaExpected,
    };

    jest.spyOn(mockMediaService, "findOne").mockReturnValue(mediaExpected);

    //Act
    const result = await mediaController.findOne("1");

    //Assert
    expect(mockMediaService.findOne).toBeCalled();
    expect(result).toEqual(mockBaseRequestResult);
  });

  it("All => Should be list of Medias", async () => {
    //Arrange
    const mediaListExpected: Array<Media> = [
      {
        id: 1,
        model_id: 1,
        model_type: "resource",
        collection_name: "teste",
        metadata: "{prop: value}",
        filename: "arquivo-teste.jpg",
        mime_type: "image",
        disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
        size: 222,
        url: "www.url.com.br/teste",
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null,
        resource: null,
      },
      {
        id: 2,
        model_id: 1,
        model_type: "resource",
        collection_name: "teste",
        metadata: "{prop: value}",
        filename: "arquivo-teste2.jpg",
        mime_type: "image",
        disk: "aws-s2.school.cloud/teste/arquivo-teste2.jpg",
        size: 202,
        url: "www.url.com.br/teste",
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null,
        resource: null,
      },
    ];

    const mockBaseRequestResult: BaseRequestResult = {
      status_code: HttpStatus.OK,
      message: BaseRequestMessages.Found,
      data: mediaListExpected,
    };

    jest.spyOn(mockMediaService, "findAll").mockReturnValue(mediaListExpected);

    //Act
    const result = await mediaController.findAll();

    //Assert
    expect(mockMediaService.findAll).toBeCalled();
    expect(result).toEqual(mockBaseRequestResult);
  });

  it("Create => Should create a Media", async () => {
    //Arrange
    const mediaExpected: Media = {
      id: 1,
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste.jpg",
      mime_type: "image",
      disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
      size: 222,
      url: "www.url.com.br/teste",
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
      resource: null,
    };

    const mediaDto: CreateMediaDto = {
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste.jpg",
      mime_type: "image",
      disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
      size: 222,
      resourceId: 1,
    };

    const mockBaseRequestResult: BaseRequestResult = {
      status_code: HttpStatus.CREATED,
      message: BaseRequestMessages.Created,
      data: mediaExpected,
    };

    jest.spyOn(mockMediaService, "create").mockReturnValue(mediaExpected);

    //Act
    const result = await mediaController.create(mediaDto);

    //Assert
    expect(mockMediaService.create).toBeCalled();
    expect(mockMediaService.create).toBeCalledWith(mediaDto);
    expect(result).toEqual(mockBaseRequestResult);
  });

  it("Delete => Should remove an Media", async () => {
    //Arrange
    const mockBaseRequestResult: BaseRequestResult = {
      status_code: HttpStatus.OK,
      message: BaseRequestMessages.Deleted,
      data: null,
    };

    jest.spyOn(mockMediaService, "remove").mockReturnValue("success");

    //Act
    const result = await mediaController.remove("1");

    //Assert
    expect(mockMediaService.remove).toBeCalled();
    expect(result).toEqual(mockBaseRequestResult);
  });

  it("Paginated => Should be return a list of Medias", async () => {
    //Arrange
    const mediaListExpected: Array<Media> = [
      {
        id: 1,
        model_id: 1,
        model_type: "resource",
        collection_name: "teste",
        metadata: "{prop: value}",
        filename: "arquivo-teste.jpg",
        mime_type: "image",
        disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
        size: 222,
        url: "www.url.com.br/teste",
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null,
        resource: null,
      },
      {
        id: 2,
        model_id: 1,
        model_type: "resource",
        collection_name: "teste",
        metadata: "{prop: value}",
        filename: "arquivo-teste2.jpg",
        mime_type: "image",
        disk: "aws-s2.school.cloud/teste/arquivo-teste2.jpg",
        size: 202,
        url: "www.url.com.br/teste",
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null,
        resource: null,
      },
    ];

    const mediaFilter: MediaFilter = {
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "arquivo-teste2.jpg",
      creatorId: 1,
      resourceId: 1,
    };

    const paginatedRequest = new BaseListiningRequest<MediaFilter>(
      null,
      null,
      1,
      20,
      mediaFilter
    );

    const expectedResult = new BaseListiningRequestResult<Media>(
      mediaListExpected,
      1,
      20,
      1,
      true,
      false
    );

    const mockBaseRequestResult: BaseRequestResult = {
      status_code: HttpStatus.OK,
      message: BaseRequestMessages.Found,
      data: expectedResult,
    };

    jest
      .spyOn(mockMediaService, "findAllPaginated")
      .mockReturnValue(expectedResult);

    //Act
    const result = await mediaController.listPaginated(
      null,
      null,
      1,
      20,
      mediaFilter
    );

    //Assert
    expect(mockMediaService.findAllPaginated).toBeCalled();
    expect(mockMediaService.findAllPaginated).toBeCalledWith(paginatedRequest);
    expect(result).toEqual(mockBaseRequestResult);
  });

  it("Upload => Should return path", async () => {
    //Arrange
    const mockFile = {
      fieldname: "file",
      originalname: "fotoTestes.jpg",
      encoding: "7bit",
      mimetype: "image/jpg",
      buffer: Buffer.from(__dirname + "storage/uploads/peleTeste.png", "utf8"),
      size: 51828,
    } as Express.Multer.File;

    const mockBaseRequestResult = {
      statusCode: HttpStatus.OK,
      message: "Operation succeeded",
      path: "fotoTestes.jpg",
    };

    //Act
    const result = await mediaController.uploadFile(mockFile);

    //Assert
    expect(result).toEqual(mockBaseRequestResult);
  });
});
