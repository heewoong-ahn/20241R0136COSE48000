import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserAccessorySave } from 'src/entities/save-clothes/user-accessory-save.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';

@Injectable()
export class UserAccessorySaveRepository extends Repository<UserAccessorySave> {
  constructor(dataSource: DataSource) {
    super(UserAccessorySave, dataSource.createEntityManager());
  }

  async clipAccessory(clothId: number, userId: number) {
    const user = new User();
    user.id = userId;
    const accessory = new Accessory();
    accessory.id = clothId;

    const userAccessorySave = this.create({ accessory: accessory, user: user });
    await this.save(userAccessorySave);
  }

  async clippedOrNot(
    clothId: number,
    userId: number,
  ): Promise<UserAccessorySave> {
    const userAccessorySave = await this.findOne({
      where: { accessory: { id: clothId }, user: { id: userId } },
      withDeleted: true,
    });
    return userAccessorySave;
  }

  async notClipAccessory(userAccessorySave: UserAccessorySave) {
    await this.remove(userAccessorySave);
  }
}
