import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { Resource } from "@app/resources/entities/resource.entity";
import { ResourcesService } from "@app/resources/resources.service";
import { UploadS3Service } from "@app/s3/s3Bucket.service";
import { HttpException, Inject, Injectable, forwardRef } from "@nestjs/common";
import { S3 } from "aws-sdk";
import * as fs from "fs";
import { CreateMediaDto } from "./dto/create-media.dto";
import { MediaFilter } from "./dto/media-filter.dto";
import { Media } from "./entities/media.entity";
import { MediaRepository } from "./media.repository";

@Injectable()
export class MediaService {
  constructor(
    @Inject(forwardRef(() => ResourcesService))
    private readonly resourcesService: ResourcesService,
    private readonly mediaRepository: MediaRepository,
    private readonly uploadS3Service: UploadS3Service
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const media = new Media();

    media.collection_name = createMediaDto.collection_name;
    media.filename = createMediaDto.filename;
    media.disk = createMediaDto.disk;
    media.metadata = createMediaDto.metadata;
    media.size = createMediaDto.size;
    media.mime_type = createMediaDto.mime_type;
    media.model_type = createMediaDto.model_type;
    media.model_id = createMediaDto.model_id;

    let resource = new Resource();
    if (createMediaDto.resourceId != null)
      resource = await this.resourcesService.findOne(createMediaDto.resourceId);

    if (resource != null) media.resource = resource;

    const uploadResult = await this.uploadMediaToS3(media);

    console.log(uploadResult.Location);
    // media.disk = uploadResult.Location;

    this.mediaRepository.create(media);
    this.mediaRepository.save(media);

    return media;
  }

  getS3Url() {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com`;
  }

  gets3MediaPath(media: Media) {
    return `${media.collection_name}/${media.model_type}/${media.model_id}/${media.filename}`;
  }

  gets3MediaUrl(media: Media) {
    return `${this.getS3Url()}/${this.gets3MediaPath(media)}`;
  }

  uploadMediaToS3(media: Media): Promise<S3.ManagedUpload.SendData> {
    const uploadedFile = fs.readFileSync("storage/uploads/" + media.filename);
    const contentMimeType = media.mime_type;
    return this.uploadS3Service.uploadFileToBucket(
      `${media.collection_name}/${media.model_type}/${media.model_id}/${media.filename}`,
      uploadedFile,
      process.env.AWS_BUCKET_NAME,
      contentMimeType
    );
  }

  async findAll(): Promise<Media[]> {
    return await this.mediaRepository.find();
  }

  async findOne(id: number): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (media == null) throw new HttpException("Media not found", 404);
    return media;
  }

  async remove(id: number): Promise<string> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (media == null) throw new HttpException("Media not found", 404);

    media.deletedAt = new Date();

    this.mediaRepository.delete(media);
    this.mediaRepository.save(media);

    return "Deleted successfully";
  }

  async findAllPaginated(
    params: BaseListiningRequest<MediaFilter>
  ): Promise<BaseListiningRequestResult<Media>> {
    const per_page = params.per_page || 10;
    const skip = params.per_page * (params.page - 1) || 0;
    const query = this.mediaRepository.createQueryBuilder("media");

    if (params.filters != null) {
      if (params.filters.collection_name != null)
        query.where("media.collection like :collection", {
          collection: params.filters.collection_name,
        });

      if (params.filters.model_type != null)
        query.where("media.model_type like :model_type", {
          model_type: params.filters.model_type,
        });

      if (params.filters.metadata != null)
        query.where("media.metadata like :metadata", {
          metadata: params.filters.metadata,
        });

      if (params.filters.filename != null)
        query.where("media.filename like: filename", {
          filename: params.filters.filename,
        });

      if (
        params.filters.resourceId != null ||
        params.filters.creatorId != null
      ) {
        query.leftJoin("media.resource", "res");

        if (params.filters.resourceId != null)
          query.where("res.id = :res_id", {
            res_id: params.filters.resourceId,
          });

        if (params.filters.creatorId != null)
          query.where("res.creatorId = :creator_id", {
            creator_id: params.filters.creatorId,
          });
      }
    }

    if (params.orderBy != null)
      query.orderBy(params.orderBy, params.orderDirection);

    const total = await query.getCount();
    const num_pages = Math.ceil(total / per_page);
    const data = await query.skip(skip).take(per_page).getMany();
    const next_page = num_pages > params.page;
    const prev_page = params.page > 1;

    return new BaseListiningRequestResult<Media>(
      data,
      params.page,
      per_page,
      num_pages,
      next_page,
      prev_page
    );
  }
}
