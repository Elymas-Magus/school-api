import { Resource } from "@app/resources/entities/resource.entity";
import { UploadS3Service } from "@app/s3/s3Bucket.service";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { S3 } from "aws-sdk";
import { ResourcesService } from "../resources/resources.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { Media } from "./entities/media.entity";
import { MediaRepository } from "./media.repository";
import { MediaService } from "./media.service";

describe("MediaService", () => {
  let mediaService: MediaService;

  const resourcesService = {
    findOne: jest.fn(),
  };

  const mediaRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const uploadS3Service = {
    uploadFileToBucket: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: ResourcesService,
          useValue: resourcesService,
        },
        {
          provide: getRepositoryToken(MediaRepository),
          useValue: mediaRepository,
        },
        {
          provide: UploadS3Service,
          useValue: uploadS3Service,
        },
      ],
    }).compile();

    mediaService = module.get<MediaService>(MediaService);
  });

  it("should be defined", () => {
    expect(mediaService).toBeDefined();
  });

  it("findOne => Should return a Media", async () => {
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

    jest.spyOn(mediaRepository, "findOne").mockReturnValue(mediaExpected);

    //Act
    const result = await mediaService.findOne(1);

    //Assert
    expect(mediaRepository.findOne).toBeCalled();
    expect(result).toEqual(mediaExpected);
  });

  it("findAll => Should return a Media", async () => {
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
        size: 222,
        url: "www.url.com.br/teste2",
        createdAt: new Date(),
        deletedAt: null,
        updatedAt: null,
        resource: null,
      },
    ];

    jest.spyOn(mediaRepository, "find").mockReturnValue(mediaListExpected);

    //Act
    const result = await mediaService.findAll();

    //Assert
    expect(mediaRepository.find).toBeCalled();
    expect(result).toEqual(mediaListExpected);
  });

  it("should create a new media", async () => {
    //Arrange
    const createMediaDto: CreateMediaDto = {
      model_id: 1,
      model_type: "resource",
      collection_name: "teste",
      metadata: "{prop: value}",
      filename: "peleTeste.png",
      mime_type: "image",
      disk: "aws-s2.school.cloud/teste/arquivo-teste.jpg",
      size: 222,
      resourceId: 1,
    };

    const resource: Resource = {
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

    const s3Return: S3.ManagedUpload.SendData = {
      Location: expect.any(String),
      Bucket: expect.any(String),
      ETag: expect.any(String),
      Key: expect.any(String),
    };

    jest.spyOn(resourcesService, "findOne").mockReturnValue(resource);
    jest.spyOn(uploadS3Service, "uploadFileToBucket").mockReturnValue(s3Return);
    jest.spyOn(mediaRepository, "create").mockReturnValue(expect.any(Media));
    jest.spyOn(mediaRepository, "save").mockResolvedValue(expect.any(Media));

    //Act
    const result = await mediaService.create(createMediaDto);

    //Assert
    expect(result).toEqual(expect.any(Media));
    expect(result).toEqual({
      collection_name: createMediaDto.collection_name,
      filename: createMediaDto.filename,
      disk: createMediaDto.disk,
      metadata: createMediaDto.metadata,
      size: createMediaDto.size,
      mime_type: createMediaDto.mime_type,
      model_type: createMediaDto.model_type,
      model_id: createMediaDto.model_id,
      resource: resource,
    });
  });
});
