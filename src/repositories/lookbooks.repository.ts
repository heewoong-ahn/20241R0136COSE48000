import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { LookBook } from 'src/entities/lookbooks.entity';
import {
  SaveLookBookDto,
  SaveLookBookWithoutClothIdDto,
} from 'src/lookbook/dtos/save-lookbook.dto';
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

  async deleteLookBook(lookbook: LookBook) {
    this.softRemove(lookbook);
  }

  async getLookBookCollection(keyword: string): Promise<LookBook[]> {
    const lookbookCollection = this.createQueryBuilder('lookbook')
      .leftJoinAndSelect('lookbook.topLookBooks', 'topLookBook')
      .leftJoinAndSelect('topLookBook.top', 'top')
      .leftJoinAndSelect('lookbook.accessoryLookBooks', 'accessoryLookBook')
      .leftJoinAndSelect('accessoryLookBook.accessory', 'accessory')
      .leftJoinAndSelect('lookbook.pant', 'pant')
      .leftJoinAndSelect('lookbook.shoe', 'shoe')
      .select([
        'lookbook.id',
        'topLookBook',
        'top.url',
        'accessoryLookBook',
        'accessory.url',
        'pant.url',
        'shoe.url',
        'lookbook.type',
      ]);

    //keyword값이 존재할때만 filter를 해서 불필요한 비용 절감.
    if (keyword) {
      const filteredLookBookCollection = lookbookCollection
        .where(
          "array_to_string(lookbook.type, ',') ILIKE :keyword OR lookbook.title ILIKE :keyword OR lookbook.memo ILIKE :keyword OR top.type ILIKE :keyword OR pant.type ILIKE :keyword OR shoe.type ILIKE :keyword OR accessory.type ILIKE :keyword",
          { keyword: `%${keyword}%` },
        )
        .orderBy('lookbook.createdAt', 'DESC')
        .getMany();
      return filteredLookBookCollection;
    }

    const defaultLookbookCollection = await lookbookCollection
      .orderBy('lookbook.createdAt', 'DESC')
      .getMany();

    return defaultLookbookCollection;
  }
}
