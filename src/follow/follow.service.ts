import { Injectable } from '@nestjs/common';
import { FollowRepository } from 'src/repositories/follows.repository';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async followNotFollow(otherUserUUID: string, myUserId: number) {
    const otherUser = await this.userRepository.findOne({
      where: { uuid: otherUserUUID },
    });
    const followingOrNot = await this.followRepository.followingOrNot(
      otherUser.id,
      myUserId,
    );
    //팔로잉 하고 있다면 팔로잉 취소.
    if (followingOrNot) {
      await this.followRepository.notFollow(followingOrNot);
      const myUser = await this.userRepository.findUserById(myUserId);
      otherUser.followerCnt -= 1;
      myUser.followingCnt -= 1;
      await this.userRepository.save(otherUser);
      await this.userRepository.save(myUser);
      return;
    }
    //팔로잉 안하고 있었다면.
    await this.followRepository.follow(otherUser.id, myUserId);
    const myUser = await this.userRepository.findUserById(myUserId);
    otherUser.followerCnt += 1;
    myUser.followingCnt += 1;
    await this.userRepository.save(otherUser);
    await this.userRepository.save(myUser);
    return;
  }

  async getFollowerList(userUUID: string): Promise<string[]> {
    const user = await this.userRepository.findUserByUUID(userUUID);
    const linkList = await this.followRepository.getFollowerList(user.id);
    const followerList = linkList.map((link) => link.follower.nickname);
    return followerList;
  }

  async getFollowingList(userUUID: string): Promise<string[]> {
    const user = await this.userRepository.findUserByUUID(userUUID);
    const linkList = await this.followRepository.getFollowingList(user.id);
    const followingList = linkList.map((link) => link.followed.nickname);
    return followingList;
  }
}
