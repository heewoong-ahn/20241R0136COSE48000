import { Injectable, NotFoundException } from '@nestjs/common';
import { Top } from 'src/entities/clothes/tops.entity';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { ResponseClothDto } from 'src/clothes/dtos/response-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { UploadClothDto } from 'src/clothes/dtos/upload-cloth.dto';

@Injectable()
export class TopRepository extends Repository<Top> {
  constructor(dataSource: DataSource) {
    super(Top, dataSource.createEntityManager());
  }
  async findTopById(id: number) {
    const top = this.findOne({ where: { id: id } });
    if (!top) {
      throw new NotFoundException('해당 상의가 존재하지 않습니다.');
    }
    return top;
  }

  async uploadTop(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ): Promise<ResponseClothDto> {
    const user = new User();
    user.id = userId;
    const top = this.create({
      url: s3Url,
      type: uploadClothDto.type,
      memo: uploadClothDto.memo,
      user: user,
    });
    return new ResponseClothDto(
      await this.save(top),
      ClothCategory.tops,
      false,
    );
  }

  async deleteTop(top: Top) {
    await this.softRemove(top);
  }

  async getTopCollection(id: number): Promise<Top[]> {
    console.log(id);
    const topCollection = this.find({ where: { user: { id: id } } });
    return topCollection;
  }
}
