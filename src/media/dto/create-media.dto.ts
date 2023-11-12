import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateMediaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  model_type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  model_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  collection_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  metadata: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mime_type: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  filename: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  disk: string;

  @ApiProperty()
  @IsNumber()
  resourceId: number;
}
