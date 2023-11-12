import { Media } from "@app/media/entities/media.entity";
import { MediaModule } from "@app/media/media.module";
import { SubjectModule } from "@app/subject/subject.module";
import { User } from "@app/users/entities/user.entity";
import { UsersModule } from "@app/users/users.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Resource } from "./entities/resource.entity";
import { ResourcesController } from "./resources.controller";
import { ResourceRepository } from "./resources.repository";
import { ResourcesService } from "./resources.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, User, Media]),
    UsersModule,
    SubjectModule,
    forwardRef(() => MediaModule),
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService, ResourceRepository],
  exports: [ResourcesService],
})
export class ResourcesModule {}
