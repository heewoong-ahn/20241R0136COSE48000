import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from 'src/entities/follows.entity';
import { FollowService } from './follow.service';
import { FollowRepository } from 'src/repositories/follows.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { User } from 'src/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User])],
  controllers: [FollowController],
  providers: [FollowService, FollowRepository, UserRepository],
})
export class FollowModule {}
