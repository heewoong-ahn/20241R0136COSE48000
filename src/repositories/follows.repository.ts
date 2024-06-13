import { Injectable } from '@nestjs/common';
import { Follow } from 'src/entities/follows.entity';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class FollowRepository extends Repository<Follow> {
  constructor(dataSource: DataSource) {
    super(Follow, dataSource.createEntityManager());
  }

  async followingOrNot(otherUserId: number, myUserId: number): Promise<Follow> {
    const followingOrNot = await this.findOne({
      where: { followed: { id: otherUserId }, follower: { id: myUserId } },
    });
    return followingOrNot;
  }

  async notFollow(followToDelete: Follow) {
    this.remove(followToDelete);
    return;
  }

  async follow(otherUserId: number, myUserId: number) {
    const otherUser = new User();
    otherUser.id = otherUserId;
    const myUser = new User();
    myUser.id = myUserId;

    const followToCreate = this.create({
      followed: otherUser,
      follower: myUser,
    });

    await this.save(followToCreate);
  }

  async getFollowerList(userId: number): Promise<Follow[]> {
    const followerList = this.find({
      where: { followed: { id: userId } },
      relations: ['followed', 'follower'],
    });
    return followerList;
  }

  async getFollowingList(userId: number): Promise<Follow[]> {
    const followingList = this.find({
      where: { follower: { id: userId } },
      relations: ['followed', 'follower'],
    });
    return followingList;
  }
}
