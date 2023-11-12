import { PartialType } from "@nestjs/mapped-types";
import { CreateResourceDto } from "./create-resource.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class UpdateResourceDto extends PartialType(CreateResourceDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
}
