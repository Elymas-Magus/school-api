import { Module } from "@nestjs/common";
import { UploadS3Service } from "./s3Bucket.service";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([S3Module])],
  providers: [UploadS3Service],
  exports: [UploadS3Service],
})
export class S3Module {}
