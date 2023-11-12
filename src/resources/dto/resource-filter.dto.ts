import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class ResourceFilter {
  @ApiPropertyOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsNumber()
  creatorId: number;

  @ApiPropertyOptional()
  @IsNumber()
  subjectId: number;
}
