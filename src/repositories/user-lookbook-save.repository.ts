import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserLookBookSave } from 'src/entities/save-clothes/user-lookbook-save.entity';
import { LookBook } from 'src/entities/lookbooks.entity';

@Injectable()
export class UserLookBookSaveRepository extends Repository<UserLookBookSave> {
  constructor(dataSource: DataSource) {
    super(UserLookBookSave, dataSource.createEntityManager());
  }

  async clipLookBook(lookbookId: number, userId: number) {
    const user = new User();
    user.id = userId;
    const lookbook = new LookBook();
    lookbook.id = lookbookId;

    const userLookBookSave = this.create({ lookbook: lookbook, user: user });
    await this.save(userLookBookSave);
    return;
  }

  async clippedOrNot(
    lookbookId: number,
    userId: number,
  ): Promise<UserLookBookSave> {
    const userLookBookSave = await this.findOne({
      where: { lookbook: { id: lookbookId }, user: { id: userId } },
      withDeleted: true,
    });
    return userLookBookSave;
  }

  async notClipLookBook(userLookBookSave: UserLookBookSave) {
    await this.remove(userLookBookSave);
    return;
  }

  async getClippedLookBookCollection(userId: number) {
    const clippedLookBookCollection = await this.createQueryBuilder(
      'userLookBookSave',
    )
      .leftJoinAndSelect('userLookBookSave.lookbook', 'lookbook')
      .leftJoinAndSelect('userLookBookSave.user', 'user')
      .leftJoinAndSelect('lookbook.topLookBooks', 'topLookBook')
      .leftJoinAndSelect('topLookBook.top', 'top')
      .leftJoinAndSelect('lookbook.accessoryLookBooks', 'accessoryLookBook')
      .leftJoinAndSelect('accessoryLookBook.accessory', 'accessory')
      .leftJoinAndSelect('lookbook.pant', 'pant')
      .leftJoinAndSelect('lookbook.shoe', 'shoe')
      .select([
        'userLookBookSave.id',
        'lookbook.id',
        'topLookBook',
        'top.url',
        'accessoryLookBook',
        'accessory.url',
        'pant.url',
        'shoe.url',
      ])
      .where('user.id = :userId', { userId: userId })
      .orderBy('lookbook.id', 'DESC')
      .getMany();

    return clippedLookBookCollection;
  }
}
