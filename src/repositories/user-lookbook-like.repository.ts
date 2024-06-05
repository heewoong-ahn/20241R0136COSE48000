import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { LookBook } from 'src/entities/lookbooks.entity';
import { UserLookBookLike } from 'src/entities/user-lookbook-like.entity';

@Injectable()
export class UserLookBookLikeRepository extends Repository<UserLookBookLike> {
  constructor(dataSource: DataSource) {
    super(UserLookBookLike, dataSource.createEntityManager());
  }

  async likeLookBook(lookbookId: number, userId: number) {
    const user = new User();
    user.id = userId;
    const lookbook = new LookBook();
    lookbook.id = lookbookId;

    const userLookBookLike = this.create({ lookbook: lookbook, user: user });
    await this.save(userLookBookLike);
    return;
  }

  async likedOrNot(
    lookbookId: number,
    userId: number,
  ): Promise<UserLookBookLike> {
    const userLookBookLike = await this.findOne({
      where: { lookbook: { id: lookbookId }, user: { id: userId } },
      withDeleted: true,
    });
    return userLookBookLike;
  }

  async notLikeLookBook(userLookBookLike: UserLookBookLike) {
    await this.remove(userLookBookLike);
    return;
  }
}
