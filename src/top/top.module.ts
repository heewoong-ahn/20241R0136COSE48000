import { Module } from '@nestjs/common';
import { TopController } from './top.controller';
import { TopService } from './top.service';
import { S3Service } from 'src/s3/s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Top } from 'src/entities/clothes/tops.entity';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access';
import { User } from 'src/entities/users.entity';
import { TopRepository } from 'src/repositories/tops.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Top, User])],
  controllers: [TopController],
  providers: [TopService, S3Service, JwtAccessStrategy, TopRepository],
})
export class TopModule {}
