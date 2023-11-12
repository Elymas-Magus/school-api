import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class BaseListiningRequest<T> {
  constructor(
    orderBy: string,
    orderDirection: "ASC" | "DESC",
    page: number = null,
    per_page: number = null,
    filters: T
  ) {
    (this.orderBy = orderBy),
      (this.orderDirection = orderDirection),
      (this.page = page),
      (this.per_page = per_page),
      (this.filters = filters);
  }

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderBy?: string = 'id';

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  orderDirection?: "ASC" | "DESC" = 'ASC';

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

  @ApiProperty()
  @IsArray()
  filters?: T;
}
