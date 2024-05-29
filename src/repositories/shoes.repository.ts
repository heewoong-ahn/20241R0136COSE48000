import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { ResponseClothDto } from 'src/clothes/dtos/response-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { UploadClothDto } from 'src/clothes/dtos/upload-cloth.dto';
import { Shoe } from 'src/entities/clothes/shoes.entity';

@Injectable()
export class ShoeRepository extends Repository<Shoe> {
  constructor(dataSource: DataSource) {
    super(Shoe, dataSource.createEntityManager());
  }
  async findShoeById(id: number) {
    const shoe = this.findOne({ where: { id: id } });
    if (!shoe) {
      throw new NotFoundException('해당 신발이 존재하지 않습니다.');
    }
    return shoe;
  }

  async uploadShoe(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ): Promise<ResponseClothDto> {
    const user = new User();
    user.id = userId;
    const shoe = this.create({
      url: s3Url,
      type: uploadClothDto.type,
      memo: uploadClothDto.memo,
      user: user,
    });
    return new ResponseClothDto(await this.save(shoe), ClothCategory.shoes);
  }

  async deleteShoe(shoe: Shoe) {
    await this.softRemove(shoe);
  }

  async getShoeCollection(id: number): Promise<Shoe[]> {
    console.log(id);
    const shoeCollection = this.find({ where: { user: { id: id } } });
    return shoeCollection;
  }
}
