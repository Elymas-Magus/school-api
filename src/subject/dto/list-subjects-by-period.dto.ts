import { Subject } from "@app/subject/entities/subject.entity";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ListSubjectsByPeriod {
  constructor(period: number, subjects: Subject[]) {
    (this.period = period), (this.subjects = subjects);
  }
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  period: number;

  @ApiProperty()
  subjects: Subject[];
}
