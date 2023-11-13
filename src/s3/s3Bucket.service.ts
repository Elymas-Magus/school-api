import { Injectable } from "@nestjs/common";
import { AWSError, S3 } from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";

@Injectable()
export class UploadS3Service {
  async uploadFileToBucket(
    keyOfFile: string,
    dataBuffer: Buffer,
    bucketName: string,
    contentType: string
  ): Promise<S3.ManagedUpload.SendData> {
    const s3 = new S3();

    s3.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const result = await s3
      .upload({
        Bucket: bucketName,
        Body: dataBuffer,
        Key: keyOfFile,
        ContentType: contentType,
      })
      .promise();

    return result;
  }

  async deleteFileInS3Bucket(
    keyOfFile: string,
    bucketName: string
  ): Promise<PromiseResult<S3.DeleteObjectOutput, AWSError>> {
    const s3 = new S3();

    s3.config.update({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const result = await s3
      .deleteObject({
        Bucket: bucketName,
        Key: keyOfFile,
      })
      .promise();

    return result;
  }
}
