import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  Max,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class BaseListiningRequestResult<T> {
  constructor(
    data: T[],
    page: number,
    per_page: number,
    num_pages: number,
    next_page: boolean,
    prev_page: boolean
  ) {
    this.data = data;
    this.page = page;
    this.per_page = per_page;
    this.num_pages = num_pages;
    this.next_page = next_page;
    this.prev_page = prev_page;
  }

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  per_page?: number = 10;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  num_pages?: number;

  @Type(() => Boolean)
  @IsBoolean()
  next_page: boolean;

  @Type(() => Boolean)
  @IsBoolean()
  prev_page: boolean;

  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];
}
