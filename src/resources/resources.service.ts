import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { MediaService } from "@app/media/media.service";
import { SubjectService } from "@app/subject/subject.service";
import { UsersService } from "@app/users/users.service";
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from "@nestjs/common";
import { AddNewMediasToResourceDto } from "./dto/add-medias.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceFilter } from "./dto/resource-filter.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { Resource } from "./entities/resource.entity";
import { ResourceRepository } from "./resources.repository";
import { CreateMediaDto } from "@app/media/dto/create-media.dto";
// import { User } from "@app/users/entities/user.entity";
@Injectable()
export class ResourcesService {
  constructor(
    private readonly resourceRepo: ResourceRepository,
    private readonly userService: UsersService,
    private readonly subjectService: SubjectService,
    @Inject(forwardRef(() => MediaService))
    private readonly mediaService: MediaService
  ) {}

  async list(): Promise<Resource[]> {
    return this.resourceRepo.find();
  }
  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    const newResource = new Resource();
    const { subjectId, creatorId, medias } = createResourceDto;

    newResource.title = createResourceDto.title;
    newResource.description = createResourceDto.description;
    newResource.creatorId = createResourceDto.creatorId;
    newResource.activated = true;
    newResource.createdAt = new Date();

    const subject = await this.subjectService.findOne(subjectId);
    const creator = await this.userService.findById(creatorId);

    newResource.creator = creator;
    newResource.subject = subject;

    this.resourceRepo.create(newResource);
    const resource = await this.resourceRepo.save(newResource);

    if (medias != null && medias.length > 0) {
      medias.forEach(async (media) => {
        const mediaDto = new CreateMediaDto();

        mediaDto.model_type = "Resource";
        mediaDto.model_id = resource.id;
        mediaDto.resourceId = resource.id;
        mediaDto.metadata = JSON.stringify(media.metadata);
        mediaDto.collection_name = media.collection_name;
        mediaDto.mime_type = media.mime_type;
        mediaDto.filename = media.filename;
        mediaDto.size = media.metadata.size;
        mediaDto.disk = "s3";

        this.mediaService.create(mediaDto).then((storedMedia) => {
          if (!storedMedia) {
            throw new HttpException(
              "Fail at media creation",
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
        });
      });
    }

    return newResource;
  }

  async findAll(): Promise<Resource[]> {
    return await this.resourceRepo.find();
  }

  async findAllPaginated(
    params: BaseListiningRequest<ResourceFilter>
  ): Promise<BaseListiningRequestResult<Resource>> {
    const per_page = params.per_page || 10;
    const skip = params.per_page * (params.page - 1) || 0;
    const query = this.resourceRepo.createQueryBuilder("resources");

    if (params.filters != null) {
      if (params.filters.title != null)
        query.where("resources.title like :title", {
          title: params.filters.title,
        });

      if (params.filters.description != null)
        query.where("resources.description like :desc", {
          desc: params.filters.description,
        });

      if (params.filters.subjectId != null)
        query
          .innerJoin("resources.subject", "subject")
          .where("subject.id = :id", {
            id: params.filters.subjectId,
          });

      if (params.filters.creatorId != null)
        query.where("resources.creatorId = :creatorId", {
          creatorId: params.filters.creatorId,
        });
    }

    if (params.orderBy != null)
      query.orderBy(params.orderBy, params.orderDirection);

    const total = await query.getCount();
    const num_pages = Math.ceil(total / per_page);
    const data = await query.skip(skip).take(per_page).getMany();
    const next_page = num_pages > params.page;
    const prev_page = params.page > 1;

    return new BaseListiningRequestResult<Resource>(
      data,
      params.page,
      per_page,
      num_pages,
      next_page,
      prev_page
    );
  }

  async findOne(id: number): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      relations: ["subject", "media"],
    });
    resource.media.map((media) => {
      if (media.disk == "s3") {
        media.url = this.mediaService.gets3MediaUrl(media);
      }
    });
    if (resource == null) {
      throw new HttpException("Resource not found", HttpStatus.NOT_FOUND);
    }

    return resource;
  }

  async update(
    id: number,
    updateResourceDto: UpdateResourceDto
  ): Promise<Resource> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      relations: ["subject", "media"],
    });

    (resource.description = updateResourceDto.description),
      (resource.title = updateResourceDto.title);

    this.resourceRepo.update({ id }, resource);
    this.resourceRepo.save(resource);

    return resource;
  }

  async remove(id: number): Promise<string> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
      relations: ["media"],
    });

    if (resource == null)
      throw new HttpException("Resource not found", HttpStatus.NOT_FOUND);

    resource.deletedAt = new Date();

    resource.media.forEach((mediaAlocated) => {
      mediaAlocated.deletedAt = new Date();
      this.subjectService.remove(mediaAlocated.id);
    });

    this.resourceRepo.delete(resource);
    this.resourceRepo.save(resource);

    return "Success";
  }

  async addNewMedias(
    id: number,
    data: AddNewMediasToResourceDto
  ): Promise<BaseRequestMessages> {
    const resource = await this.resourceRepo.findOne({
      where: { id },
    });

    if (resource == null)
      throw new HttpException("Resource not found", HttpStatus.NOT_FOUND);

    if (data.media != null && data.media.length > 0) {
      data.media.forEach(async (media) => {
        media.resourceId = resource.id;

        const res = await this.mediaService.create(media);

        if (res == null)
          throw new HttpException(
            "Fail at media creation",
            HttpStatus.INTERNAL_SERVER_ERROR
          );
      });
    }

    return BaseRequestMessages.Success;
  }
}
