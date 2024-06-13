import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { UserRepository } from 'src/repositories/user.repository';
import { FollowRepository } from 'src/repositories/follows.repository';
import { Follow } from 'src/entities/follows.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { LookBookRepository } from 'src/repositories/lookbooks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow, LookBook])],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    UserRepository,
    FollowRepository,
    LookBookRepository,
  ],
})
export class ProfileModule {}
