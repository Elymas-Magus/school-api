import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class SubjectFilter {
  @ApiPropertyOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  goal: string;

  @ApiPropertyOptional()
  @IsInt()
  ch_total: number;

  @ApiPropertyOptional()
  @IsInt()
  period: number;
}
