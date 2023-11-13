import { JwtAuthGuard } from "@app/auth/jwt-auth.guard";
import { BaseRequestMessages } from "@app/common/BaseModels/BaseEnums/base-request-messages.enum";
import { BaseRequestResult } from "@app/common/BaseModels/base-Request-Result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilter } from "./dto/user-filter.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Post("register")
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return new BaseRequestResult(
      HttpStatus.CREATED,
      BaseRequestMessages.Created,
      result
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list() {
    try {
      const result = await this.usersService.list();
      const response = new BaseRequestResult(
        HttpStatus.OK,
        BaseRequestMessages.Found,
        result
      );
      return response;
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async find(@Param("id") id: string) {
    try {
      const result = await this.usersService.findById(+id);
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
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.usersService.update(+id, updateUserDto);
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
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.usersService.remove(+id);
      return new BaseRequestResult(HttpStatus.OK, BaseRequestMessages.Deleted);
    } catch (e) {
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("/paginated")
  async listPaginated(
    @Query("orderBy") orderBy: string,
    @Query("orderDirection") orderDirection: "ASC" | "DESC",
    @Query("page") page: number,
    @Query("take") take: number,
    @Body() filter: UserFilter
  ) {
    try {
      const parametersOfSearch: BaseListiningRequest<UserFilter> =
        new BaseListiningRequest<UserFilter>(
          orderBy,
          orderDirection,
          page,
          take,
          filter
        );

      const result = await this.usersService.findAllPaginated(
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
}
// @UseGuards(PermissionsGuard("teste"))
