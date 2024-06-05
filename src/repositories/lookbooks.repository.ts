import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { LookBook } from 'src/entities/lookbooks.entity';
import { SaveLookBookWithoutClothIdDto } from 'src/lookbook/dtos/save-lookbook.dto';
import { User } from 'src/entities/users.entity';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';

@Injectable()
export class LookBookRepository extends Repository<LookBook> {
  constructor(dataSource: DataSource) {
    super(LookBook, dataSource.createEntityManager());
  }

  async findLookBookById(lookBookId: number) {
    const lookbook = await this.findOne({ where: { id: lookBookId } });
    return lookbook;
  }

  async showNotShow(lookbook: LookBook) {
    lookbook.show = !lookbook.show;
    await this.save(lookbook);
    return;
  }

  async notLikeLookBook(lookBookdId: number) {
    const lookbook = await this.findLookBookById(lookBookdId);
    lookbook.likeCnt -= 1;
    await this.save(lookbook);
    return;
  }

  async likeLookBook(lookBookdId: number) {
    const lookbook = await this.findLookBookById(lookBookdId);
    lookbook.likeCnt += 1;
    await this.save(lookbook);
    return;
  }

  async saveLookBook(
    saveLookBookWithoutClothIdDto: SaveLookBookWithoutClothIdDto,
    userId: number,
    pantId: number,
    shoeId: number,
  ) {
    const user = new User();
    user.id = userId;

    const pant = new Pant();
    pant.id = pantId;
    const shoe = new Shoe();
    shoe.id = shoeId;

    const lookbook = this.create({
      ...saveLookBookWithoutClothIdDto,
      user,
      pant,
      shoe,
    });

    return await this.save(lookbook);
  }
}
