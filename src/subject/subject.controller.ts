import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { Order } from "@app/common/BaseModels/BaseEnums/order.enum";
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
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateSubjectDto } from "./dto/create-subject.dto";
import { SubjectFilter } from "./dto/subject-filter.dto";
import { UpdateSubjectDto } from "./dto/update-subject.dto";
import { SubjectService } from "./subject.service";

@ApiTags("Subjects")
@Controller("subject")
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Post()
  async create(@Body() CreateSubjectDto: CreateSubjectDto) {
    try {
      const result = await this.subjectService.create(CreateSubjectDto);
      return new BaseRequestResult(
        HttpStatus.CREATED,
        BaseRequestMessages.Created,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @Get()
  async findAll() {
    try {
      const result = await this.subjectService.findAll();
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const result = await this.subjectService.findOne(+id);
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateSubjectDto: UpdateSubjectDto
  ) {
    try {
      const result = await this.subjectService.update(+id, updateSubjectDto);
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Updated,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.subjectService.remove(+id);
      return new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted);
    } catch (e) {
      return e;
    }
  }

  @Post("paginated")
  async listPaginated(
    @Query("orderBy") orderBy: string,
    @Query("orderDirection") orderDirection: "ASC" | "DESC",
    @Query("page") page: number,
    @Query("take") take: number,
    @Body() filter: SubjectFilter
  ) {
    try {
      const parametersOfSearch: BaseListiningRequest<SubjectFilter> =
        new BaseListiningRequest<SubjectFilter>(
          orderBy,
          orderDirection,
          page,
          take,
          filter
        );

      const result = await this.subjectService.findAllPaginated(
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

  @Get("period/:period")
  async findByPeriod(@Param("period") period: string) {
    try {
      const result = await this.subjectService.findByPeriod(+period);
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }

  @Get("group/period")
  async findAndGroupByPeriod() {
    try {
      const result = await this.subjectService.findAndGroupByPeriod();
      return new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
    } catch (e) {
      return e;
    }
  }
}
