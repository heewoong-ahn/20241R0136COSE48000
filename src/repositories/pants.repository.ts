import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { ResponseClothDto } from 'src/clothes/dtos/response-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { UploadClothDto } from 'src/clothes/dtos/upload-cloth.dto';
import { Pant } from 'src/entities/clothes/pants.entity';

@Injectable()
export class PantRepository extends Repository<Pant> {
  constructor(dataSource: DataSource) {
    super(Pant, dataSource.createEntityManager());
  }
  async findPantById(id: number) {
    const pant = this.findOne({ where: { id: id } });
    if (!pant) {
      throw new NotFoundException('해당 바지가 존재하지 않습니다.');
    }
    return pant;
  }

  async uploadPant(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ): Promise<ResponseClothDto> {
    const user = new User();
    user.id = userId;
    const pant = this.create({
      url: s3Url,
      type: uploadClothDto.type,
      memo: uploadClothDto.memo,
      user: user,
    });
    return new ResponseClothDto(
      await this.save(pant),
      ClothCategory.pants,
      false,
    );
  }

  async deletePant(pant: Pant) {
    await this.softRemove(pant);
  }

  async getPantCollection(id: number): Promise<Pant[]> {
    console.log(id);
    const pantCollection = this.find({ where: { user: { id: id } } });
    return pantCollection;
  }
}
