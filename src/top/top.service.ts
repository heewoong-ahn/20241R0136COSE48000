import { Injectable } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class TopService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadTop(file: Express.Multer.File) {
    return this.s3Service.uploadFile(file, 'tops');
  }
}
