import { BaseListiningRequestResult } from "@app/common/BaseModels/base-listining-request-result.dto";
import { BaseListiningRequest } from "@app/common/BaseModels/base-listining-request.dto";
import { RoleHasPermissionsService } from "@app/role_has_permissions/role_has_permissions.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { hash } from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserFilter } from "./dto/user-filter.dto";
import { User } from "./entities/user.entity";
import { Sex } from "./enums/sex_enum";
import { UserRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly roleHasPermissionsService: RoleHasPermissionsService
  ) {}

  async list(): Promise<User[]> {
    return this.userRepo.find();
  }

  async find(email: string): Promise<User | undefined> {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ["modelHasRoles", "modelHasRoles.role"],
    });
    return user;
  }

  async userUserPermission(user: any, permission: string) {
    return this.roleHasPermissionsService.authorize(user, permission);
  }

  userHasRole(user: any, role: string): boolean {
    return user.modelHasRoles.some((mhr) => {
      return mhr.role.name === role;
    });
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (user == null) throw new HttpException("User not found", 404);

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<any> | undefined {
    const query = this.userRepo.createQueryBuilder("user");

    if (createUserDto.email == null)
      throw new HttpException(`Email can't be empty`, HttpStatus.BAD_REQUEST);

    if (createUserDto.sex == null)
      throw new HttpException(`Sex can't be empty`, HttpStatus.BAD_REQUEST);

    if (createUserDto.password == null)
      throw new HttpException(
        `Password can't be empty`,
        HttpStatus.BAD_REQUEST
      );

    const user = await query
      .where("user.email like :email", {
        email: createUserDto.email,
      })
      .orWhere("user.register_number like :register_number", {
        register_number: createUserDto.ufuRegister,
      })
      .withDeleted()
      .getOne();

    if (user != null) {
      if (user.email === createUserDto.email)
        throw new HttpException(
          `User with email ${createUserDto.email} already exists`,
          HttpStatus.BAD_REQUEST
        );

      if (user.register_number === createUserDto.ufuRegister)
        throw new HttpException(
          `User with register ${createUserDto.ufuRegister} already exists`,
          HttpStatus.BAD_REQUEST
        );
    }

    const newUser = new User();

    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.password = await hash(
      createUserDto.password,
      parseInt(process.env.HASH_SALT)
    );
    newUser.email = createUserDto.email;
    newUser.createdAt = new Date();
    newUser.activated = true;
    newUser.sex = Sex[createUserDto.sex];
    newUser.register_number = createUserDto.ufuRegister;

    this.userRepo.create(newUser);
    this.userRepo.save(newUser);

    const { password, ...register } = newUser;

    return register;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<User> | undefined {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    const email = updateUserDto.email;

    if (user == null) throw new HttpException("User not found", 404);

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.password = updateUserDto.password;
    user.email = updateUserDto.email;
    user.sex = Sex[updateUserDto.sex];
    user.register_number = updateUserDto.ufuRegister;
    user.updatedAt = new Date();

    await this.userRepo.update({ email }, user);
    this.userRepo.save(user);

    return user;
  }

  async remove(id: number): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (user == null) throw new HttpException("User not found", 404);

    user.deletedAt = new Date();
    user.activated = false;

    this.userRepo.delete(user);
    this.userRepo.save(user);

    return "Deleted Successfully";
  }

  async findAllPaginated(
    params: BaseListiningRequest<UserFilter>
  ): Promise<BaseListiningRequestResult<User>> {
    const per_page = params.per_page || 10;
    const skip = params.per_page * (params.page - 1) || 0;
    const query = this.userRepo.createQueryBuilder("user");

    if (params.filters.firstName != null)
      query.where("user.firstName like :firstName", {
        firstName: params.filters.firstName,
      });

    if (params.filters.lastName != null)
      query.where("user.lastName like :lastName", {
        lastName: params.filters.lastName,
      });

    if (params.filters.email != null)
      query.where("user.email like :email", { email: params.filters.email });

    if (params.filters.register_number != null)
      query.where("user.register_number like :register_number", {
        register_number: params.filters.register_number,
      });

    if (params.filters.sex != null)
      query.where("user.sex = :sex", { sex: Sex[params.filters.sex] });

    if (params.orderBy != null)
      query.orderBy(params.orderBy, params.orderDirection);

    const total = await query.getCount();
    const num_pages = Math.ceil(total / per_page);
    const data = await query.skip(skip).take(per_page).getMany();
    const next_page = num_pages > params.page;
    const prev_page = params.page > 1;

    return new BaseListiningRequestResult<User>(
      data,
      params.page,
      per_page,
      num_pages,
      next_page,
      prev_page
    );
  }
}
