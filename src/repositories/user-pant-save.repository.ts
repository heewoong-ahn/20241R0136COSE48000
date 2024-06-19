import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserPantSave } from 'src/entities/save-clothes/user-pant-save.entity';
import { Pant } from 'src/entities/clothes/pants.entity';

@Injectable()
export class UserPantSaveRepository extends Repository<UserPantSave> {
  constructor(dataSource: DataSource) {
    super(UserPantSave, dataSource.createEntityManager());
  }

  async clipPant(clothId: number, userId: number) {
    const user = new User();
    user.id = userId;
    const pant = new Pant();
    pant.id = clothId;

    const userPantSave = this.create({ pant: pant, user: user });
    await this.save(userPantSave);
  }

  async clippedOrNot(clothId: number, userId: number): Promise<UserPantSave> {
    const userPantSave = await this.findOne({
      where: { pant: { id: clothId }, user: { id: userId } },
      withDeleted: true,
    });
    return userPantSave;
  }

  async notClipPant(userPantSave: UserPantSave) {
    await this.remove(userPantSave);
  }

  async getClippedPantCollection(userId: number): Promise<UserPantSave[]> {
    console.log(userId);
    const clippedPantCollection = await this.find({
      where: { user: { id: userId } },
      relations: ['pant'],
      withDeleted: true,
    });
    console.log(clippedPantCollection);
    return clippedPantCollection;
  }
}
