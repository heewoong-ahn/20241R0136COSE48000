import { Injectable } from '@nestjs/common';
import { TopRepository } from 'src/repositories/tops.repository';
import { S3Service } from 'src/s3/s3.service';
import { UploadTopDto } from './dtos/upload-top.dto';

@Injectable()
export class TopService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly topRepository: TopRepository,
  ) {}

  async uploadTop(
    file: Express.Multer.File,
    uploadTopDto: UploadTopDto,
    userId: number,
  ) {
    const url = await this.s3Service.uploadFile(file, 'tops');
    return await this.topRepository.uploadTop(url, userId, uploadTopDto);
  }
}
