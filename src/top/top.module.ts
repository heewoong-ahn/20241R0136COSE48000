import { Module } from '@nestjs/common';
import { TopController } from './top.controller';
import { TopService } from './top.service';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [],
  controllers: [TopController],
  providers: [TopService, S3Service],
})
export class TopModule {}
