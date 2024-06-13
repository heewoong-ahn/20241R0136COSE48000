import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { ResponseClothDto } from 'src/clothes/dtos/response-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { UploadClothDto } from 'src/clothes/dtos/upload-cloth.dto';
import { MannequinLookBook } from 'src/entities/mannequin-lookbook.entity';
import { MannequinLookBookRequestCursorPaginationDto } from 'src/lookbook/dtos/mannequin-lookbook-request-cursor-pagination.dto';

@Injectable()
export class MannequinLookBookRepository extends Repository<MannequinLookBook> {
  constructor(dataSource: DataSource) {
    super(MannequinLookBook, dataSource.createEntityManager());
  }

  async findMannequinLookBookById(mannequinLookBookId: number) {
    const mannequinLookBook = await this.findOne({
      where: { id: mannequinLookBookId },
    });
    return mannequinLookBook;
  }

  async uploadMannequinLookBook(
    s3Url: string,
    userId: number,
    title: string,
    type: string[],
    memo: string,
  ): Promise<ResponseClothDto> {
    const user = new User();
    user.id = userId;
    const mannequinLookBook = this.create({
      url: s3Url,
      title: title,
      type: type,
      memo: memo,
      user: user,
    });

    await this.save(mannequinLookBook);
    return;
  }

  async hardDeleteMannequinLookBook(mannequinLookBook: MannequinLookBook) {
    this.remove(mannequinLookBook);
  }

  async getMannequinLookBookCollection(
    mannequinLookBookRequestCursorPaginationDto: MannequinLookBookRequestCursorPaginationDto,
    userId: number,
  ) {
    const mannequinLookBookCollection = this.createQueryBuilder(
      'mannequinLookBook',
    )
      .leftJoinAndSelect('mannequinLookBook.user', 'user')
      .select(['mannequinLookBook.id', 'mannequinLookBook.url']);

    let result: any[];

    //첫 return은 매끄러운 화면 전환을 위해 take의 2배의 data를 반환. 이후 take만큼 만환.
    if (!mannequinLookBookRequestCursorPaginationDto.cursor) {
      result = await mannequinLookBookCollection
        .where('user.id = :userId', {
          userId: userId,
        })
        .orderBy('mannequinLookBook.id', 'DESC')
        .take(mannequinLookBookRequestCursorPaginationDto.take * 2 + 1)
        .getMany();
    } else {
      result = await mannequinLookBookCollection
        .where('mannequinLookBook.id < :cursor', {
          cursor: mannequinLookBookRequestCursorPaginationDto.cursor,
        })
        .andWhere('user.id = :userId', {
          userId: userId,
        })
        .orderBy('mannequinLookBook.id', 'DESC')
        .take(mannequinLookBookRequestCursorPaginationDto.take + 1)
        .getMany();
    }

    return result;
  }

  async getMannequinLookBookDetail(
    mannequinLookBookRequestCursorPaginationDto: MannequinLookBookRequestCursorPaginationDto,
    userId: number,
  ) {
    const mannequinLookBookDetail = this.createQueryBuilder('mannequinLookBook')
      .leftJoinAndSelect('mannequinLookBook.user', 'user')
      .select([
        'mannequinLookBook.id',
        'mannequinLookBook.url',
        'mannequinLookBook.title',
        'mannequinLookBook.type',
        'mannequinLookBook.memo',
      ])
      .where('mannequinLookBook.id <= :cursor', {
        cursor: mannequinLookBookRequestCursorPaginationDto.cursor,
      })
      .andWhere('user.id = :userId', { userId: userId })
      .orderBy('mannequinLookBook.id', 'DESC')
      .take(mannequinLookBookRequestCursorPaginationDto.take + 1)
      .getMany();

    return mannequinLookBookDetail;
  }
}
