// import { ApiProperty } from "@nestjs/swagger";
// import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { CreateResourceMediaMetadataDto } from "./create-resource-media-metadata.dto";

export class CreateResourceMediaDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  collection_name: string;

  @ApiProperty()
  @IsNotEmpty()
  metadata: CreateResourceMediaMetadataDto;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mime_type: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  action: string;
}
