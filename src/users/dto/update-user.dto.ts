import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import {
  IsBoolean,
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Sex } from "../enums/sex_enum";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  ufuRegister: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(Sex)
  sex: Sex;
}
