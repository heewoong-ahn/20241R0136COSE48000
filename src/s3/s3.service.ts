import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  async uploadFile(file: Express.Multer.File, folder: string) {
    if (!file || !file.originalname) {
      throw new Error('No file uploaded or original file name missing.');
    }

    const lastDotIndex = file.originalname.lastIndexOf('.');
    const fileExtension = file.originalname.slice(lastDotIndex);
    const filename = `${uuid()}${fileExtension}`;

    await this.s3
      .putObject(
        {
          Key: `${folder}/${filename}`,
          Body: file.buffer,
          Bucket: process.env.S3_BUCKET_NAME,
          ContentType: file.mimetype,
        },
        (err) => {
          if (err) {
            throw err;
          }
        },
      )
      .promise();

    return `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folder}/${filename}`;
  }

  async deleteMannequinLookBook(s3Url: string) {
    const parsingIndex = s3Url.lastIndexOf('/', s3Url.lastIndexOf('/') - 1) + 1;
    const fileKey = s3Url.substring(parsingIndex);
    console.log(fileKey);
    await this.s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
      })
      .promise();
  }
}
