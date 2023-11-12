import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
export class CreateSubjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  goal: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  curriculum: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  ch_total: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  period: number;
}
