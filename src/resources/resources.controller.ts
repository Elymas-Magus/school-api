import { JwtAuthGuard } from "@app/auth/jwt-auth.guard";
import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseRequestResult } from "@app/common/BaseModels/base-Request-Result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AddNewMediasToResourceDto } from "./dto/add-medias.dto";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { ResourceFilter } from "./dto/resource-filter.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
import { ResourcesService } from "./resources.service";

@ApiTags("Resources")
@Controller("resources")
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() {
    try {
      const result = await this.resourcesService.findAll();
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("/paginated")
  async listPaginated(
    @Query("orderBy") orderBy: string,
    @Query("orderDirection") orderDirection: "ASC" | "DESC",
    @Query("page") page: number,
    @Query("take") take: number,
    @Query() filters: ResourceFilter
  ) {
    try {
      const parametersOfSearch: BaseListiningRequest<ResourceFilter> =
        new BaseListiningRequest<ResourceFilter>(
          orderBy,
          orderDirection,
          page,
          take,
          filters
        );

      const result = await this.resourcesService.findAllPaginated(
        parametersOfSearch
      );
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const result = await this.resourcesService.findOne(+id);
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createResourceDto: CreateResourceDto) {
    try {
      createResourceDto.creatorId = req.user.id;
      const result = await this.resourcesService.create(createResourceDto);
      return new BaseRequestResult(
        HttpStatus.CREATED,
        BaseRequestMessages.Created,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    try {
      const result = await this.resourcesService.update(+id, updateResourceDto);
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Updated,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch("add-medias/:id")
  async addNewMedias(
    @Param("id") id: string,
    @Body() newMedias: AddNewMediasToResourceDto
  ) {
    try {
      const result = await this.resourcesService.addNewMedias(+id, newMedias);
      return new BaseRequestResult(HttpStatus.OK, result.toString(), null);
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.resourcesService.remove(+id);
      return new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted);
    } catch (e) {
      return e;
    }
  }
}
