import { Injectable } from '@nestjs/common';
import { FollowRepository } from 'src/repositories/follows.repository';
import { LookBookRepository } from 'src/repositories/lookbooks.repository';
import { UserRepository } from 'src/repositories/user.repository';
import {
  OtherUserProfileResponseDto,
  myProfileResponseDto,
} from './dtos/profile-response-dto';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly followRepository: FollowRepository,
    private readonly lookbookRepository: LookBookRepository,
  ) {}

  async getOtherUserProfile(
    userUUID: string,
    myUserId: number,
  ): Promise<OtherUserProfileResponseDto> {
    const otherUser = await this.userRepository.findUserByUUID(userUUID);
    const lookbookCnt = await this.lookbookRepository.count({
      where: { user: { id: otherUser.id }, show: true },
    });
    const followingOrNot = await this.followRepository.followingOrNot(
      otherUser.id,
      myUserId,
    );
    const following = followingOrNot ? true : false;

    return new OtherUserProfileResponseDto(otherUser, lookbookCnt, following);
  }

  async getMyProfile(userId: number): Promise<myProfileResponseDto> {
    const user = await this.userRepository.findUserById(userId);
    const lookbookCnt = await this.lookbookRepository.count({
      where: { user: { id: user.id } },
    });

    return new myProfileResponseDto(user, lookbookCnt);
  }
}
