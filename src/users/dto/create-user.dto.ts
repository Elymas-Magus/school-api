import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, IsEnum } from "class-validator";
import { Sex } from "../enums/sex_enum";

export class CreateUserDto {
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
