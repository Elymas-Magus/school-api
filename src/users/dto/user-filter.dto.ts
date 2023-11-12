import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UserFilter {
  @ApiPropertyOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsString()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  sex: string;

  @ApiPropertyOptional()
  @IsString()
  register_number: string;
}
