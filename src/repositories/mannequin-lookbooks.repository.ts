import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { ResponseClothDto } from 'src/clothes/dtos/response-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { UploadClothDto } from 'src/clothes/dtos/upload-cloth.dto';
import { MannequinLookBook } from 'src/entities/mannequin-lookbook.entity';

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
}
