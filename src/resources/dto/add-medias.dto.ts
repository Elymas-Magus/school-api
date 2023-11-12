import { CreateMediaDto } from "@app/media/dto/create-media.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AddNewMediasToResourceDto {
  @ApiProperty({ type: CreateMediaDto, isArray: true })
  media: CreateMediaDto[];
}
