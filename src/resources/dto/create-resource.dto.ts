import { CreateResourceMediaDto } from "./create-resource-media.dto";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateResourceDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  creatorId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  subjectId: number;

  @ApiProperty({ type: CreateResourceMediaDto, isArray: true })
  medias: CreateResourceMediaDto[];
}
