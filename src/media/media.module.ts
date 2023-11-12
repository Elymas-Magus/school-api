import { Module, forwardRef } from "@nestjs/common";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { Resource } from "@app/resources/entities/resource.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./entities/media.entity";
import { UsersModule } from "@app/users/users.module";
import { MediaRepository } from "./media.repository";
import { ResourcesModule } from "@app/resources/resources.module";
import { S3Module } from "@app/s3/s3Bucket.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, Media]),
    UsersModule,
    forwardRef(() => ResourcesModule),
    S3Module,
  ],
  controllers: [MediaController],
  exports: [MediaService, MediaRepository],
  providers: [MediaService, MediaRepository],
})
export class MediaModule {}
