import { Injectable, NotFoundException } from '@nestjs/common';
import { Top } from 'src/entities/clothes/tops.entity';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { UserTopSave } from 'src/entities/save-clothes/user-top-save.entity';

@Injectable()
export class UserTopSaveRepository extends Repository<UserTopSave> {
  constructor(dataSource: DataSource) {
    super(UserTopSave, dataSource.createEntityManager());
  }

  async clipTop(clothId: number, userId: number) {
    const user = new User();
    user.id = userId;
    const top = new Top();
    top.id = clothId;

    const userTopSave = this.create({ top: top, user: user });
    await this.save(userTopSave);
  }

  async clippedOrNot(clothId: number, userId: number): Promise<UserTopSave> {
    const userTopSave = await this.findOne({
      where: { top: { id: clothId }, user: { id: userId } },
      //이미 삭제된 게시글의 옷에 대한 찜을 취소하고 싶을 때를 위해 softremove된것도 포함해서 탐색.
      withDeleted: true,
    });
    return userTopSave;
  }

  async notClipTop(userTopSave: UserTopSave) {
    await this.remove(userTopSave);
  }
}
