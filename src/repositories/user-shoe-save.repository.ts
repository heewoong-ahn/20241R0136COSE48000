import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserShoeSave } from 'src/entities/save-clothes/user-shoe-save.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';

@Injectable()
export class UserShoeSaveRepository extends Repository<UserShoeSave> {
  constructor(dataSource: DataSource) {
    super(UserShoeSave, dataSource.createEntityManager());
  }

  async clipShoe(clothId: number, userId: number) {
    const user = new User();
    user.id = userId;
    const shoe = new Shoe();
    shoe.id = clothId;

    const userShoeSave = this.create({ shoe: shoe, user: user });
    await this.save(userShoeSave);
  }

  async clippedOrNot(clothId: number, userId: number): Promise<UserShoeSave> {
    const userShoeSave = await this.findOne({
      where: { shoe: { id: clothId }, user: { id: userId } },
      withDeleted: true,
    });
    return userShoeSave;
  }

  async notClipShoe(userShoeSave: UserShoeSave) {
    await this.remove(userShoeSave);
  }
}
