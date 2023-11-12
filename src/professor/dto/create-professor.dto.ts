import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail} from "class-validator";

export class CreateProfessorDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

	@ApiProperty()
    @IsNotEmpty()
    @IsString()
    sex: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    photoPath: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    facomPageUrl: string;
}