import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class MediaFilter {
  @ApiPropertyOptional()
  @IsString()
  model_type: string;

  @ApiPropertyOptional()
  @IsString()
  collection_name: string;

  @ApiPropertyOptional()
  @IsString()
  metadata: string;

  @ApiPropertyOptional()
  @IsString()
  filename: string;

  @ApiPropertyOptional()
  @IsNumber()
  creatorId: number;

  @ApiPropertyOptional()
  @IsNumber()
  resourceId: number;
}
