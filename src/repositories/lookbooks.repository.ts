import { Injectable } from '@nestjs/common';
import { Brackets, DataSource, Like, Repository } from 'typeorm';
import { LookBook } from 'src/entities/lookbooks.entity';
import {
  SaveLookBookDto,
  SaveLookBookWithoutClothIdDto,
} from 'src/lookbook/dtos/save-lookbook.dto';
import { User } from 'src/entities/users.entity';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { LookBookRequestCursorPaginationDto } from 'src/lookbook/dtos/lookbook-request-cursor-pagination.dto';

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

  async getLookBookCollection(
    lookBookRequestCursorPaginationDto: LookBookRequestCursorPaginationDto,
  ): Promise<any> {
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
      ]);

    let result: any[];

    //첫 return은 매끄러운 화면 전환을 위해 take의 2배의 data를 반환. 이후 take만큼 만환.
    if (!lookBookRequestCursorPaginationDto.cursor) {
      //검색 keyword가 없다면
      if (!lookBookRequestCursorPaginationDto.keyword) {
        result = await lookbookCollection
          .orderBy('lookbook.id', 'DESC')
          .take(lookBookRequestCursorPaginationDto.take * 2 + 1)
          .getMany();
      }
      //keyword가 있다면
      //keyword값이 존재할때만 filter를 해서 불필요한 비용 절감.
      else {
        result = await lookbookCollection
          .where(
            new Brackets((qb) => {
              qb.where("array_to_string(lookbook.type, ',') ILIKE :keyword")
                .orWhere('lookbook.title ILIKE :keyword')
                .orWhere('lookbook.memo ILIKE :keyword')
                .orWhere('top.type ILIKE :keyword')
                .orWhere('pant.type ILIKE :keyword')
                .orWhere('shoe.type ILIKE :keyword')
                .orWhere('accessory.type ILIKE :keyword');
            }),
          )
          .setParameters({
            keyword: `%${lookBookRequestCursorPaginationDto.keyword}%`,
          })
          .orderBy('lookbook.id', 'DESC')
          .take(lookBookRequestCursorPaginationDto.take * 2 + 1)
          .getMany();
      }
    }
    //cursor값이 있다면 = 2번째 이상 로딩 요청
    else {
      //keyword가 없다면
      if (!lookBookRequestCursorPaginationDto.keyword) {
        result = await lookbookCollection
          .where('lookbook.id < :cursor', {
            cursor: lookBookRequestCursorPaginationDto.cursor,
          })
          .orderBy('lookbook.id', 'DESC')
          .take(lookBookRequestCursorPaginationDto.take + 1)
          .getMany();
      }
      //keyword가 있다면
      else {
        result = await lookbookCollection
          .where('lookbook.id < :cursor')
          .andWhere(
            new Brackets((qb) => {
              qb.where("array_to_string(lookbook.type, ',') ILIKE :keyword")
                .orWhere('lookbook.title ILIKE :keyword')
                .orWhere('lookbook.memo ILIKE :keyword')
                .orWhere('top.type ILIKE :keyword')
                .orWhere('pant.type ILIKE :keyword')
                .orWhere('shoe.type ILIKE :keyword')
                .orWhere('accessory.type ILIKE :keyword');
            }),
          )
          .orderBy('lookbook.id', 'DESC')
          .take(lookBookRequestCursorPaginationDto.take + 1)
          .setParameters({
            cursor: lookBookRequestCursorPaginationDto.cursor,
            keyword: `%${lookBookRequestCursorPaginationDto.keyword}%`,
          })
          .getMany();
      }
    }

    return result;
  }

  async getLookBookDetail(
    lookBookRequestCursorPaginationDto: LookBookRequestCursorPaginationDto,
  ) {
    const lookBookDetail = this.createQueryBuilder('lookbook')
      .leftJoinAndSelect('lookbook.user', 'user')
      .leftJoinAndSelect('lookbook.topLookBooks', 'topLookBook')
      .leftJoinAndSelect('topLookBook.top', 'top')
      .leftJoinAndSelect('lookbook.accessoryLookBooks', 'accessoryLookBook')
      .leftJoinAndSelect('accessoryLookBook.accessory', 'accessory')
      .leftJoinAndSelect('lookbook.pant', 'pant')
      .leftJoinAndSelect('lookbook.shoe', 'shoe')
      .select([
        'lookbook.id',
        'user.nickname',
        'lookbook.title',
        'lookbook.type',
        'lookbook.memo',
        'lookbook.likeCnt',
        'lookbook.commentCnt',
        'topLookBook',
        'top.id',
        'top.url',
        'top.memo',
        'accessoryLookBook',
        'accessory.id',
        'accessory.url',
        'accessory.memo',
        'pant.id',
        'pant.url',
        'pant.memo',
        'shoe.id',
        'shoe.url',
        'shoe.memo',
      ]);

    let result: any[];

    if (!lookBookRequestCursorPaginationDto.keyword) {
      result = await lookBookDetail
        .where('lookbook.id <= :cursor', {
          cursor: lookBookRequestCursorPaginationDto.cursor,
        })
        .orderBy('lookbook.id', 'DESC')
        .take(lookBookRequestCursorPaginationDto.take + 1)
        .getMany();
    }
    //keyword가 있을 때: 피드를 제공할 때 keyword로 검색 후 들어간 경우 keyword로 필터링 된
    //룩북 collection에서 다음 것을 들고 와야함.
    else {
      result = await lookBookDetail
        .where('lookbook.id <= :cursor')
        .andWhere(
          new Brackets((qb) => {
            qb.where("array_to_string(lookbook.type, ',') ILIKE :keyword")
              .orWhere('lookbook.title ILIKE :keyword')
              .orWhere('lookbook.memo ILIKE :keyword')
              .orWhere('top.type ILIKE :keyword')
              .orWhere('pant.type ILIKE :keyword')
              .orWhere('shoe.type ILIKE :keyword')
              .orWhere('accessory.type ILIKE :keyword');
          }),
        )
        .orderBy('lookbook.id', 'DESC')
        .take(lookBookRequestCursorPaginationDto.take + 1)
        .setParameters({
          cursor: lookBookRequestCursorPaginationDto.cursor,
          keyword: `%${lookBookRequestCursorPaginationDto.keyword}%`,
        })
        .getMany();
    }

    console.log(lookBookRequestCursorPaginationDto.take + 1);
    console.log(result.length);
    return result;
  }
}
