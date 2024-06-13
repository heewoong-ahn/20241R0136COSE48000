import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';
import { ResponseClothDto } from 'src/clothes/dtos/response-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { UploadClothDto } from 'src/clothes/dtos/upload-cloth.dto';
import { Accessory } from 'src/entities/clothes/accessories.entity';

@Injectable()
export class AccessoryRepository extends Repository<Accessory> {
  constructor(dataSource: DataSource) {
    super(Accessory, dataSource.createEntityManager());
  }
  async findAccessoryById(id: number) {
    const accessory = this.findOne({ where: { id: id } });
    if (!accessory) {
      throw new NotFoundException('해당 액세서리가 존재하지 않습니다.');
    }
    return accessory;
  }

  async uploadAccessory(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ): Promise<ResponseClothDto> {
    const user = new User();
    user.id = userId;
    const accessory = this.create({
      url: s3Url,
      type: uploadClothDto.type,
      memo: uploadClothDto.memo,
      user: user,
    });
    return new ResponseClothDto(
      await this.save(accessory),
      ClothCategory.accessories,
      false,
    );
  }

  async deleteAccessory(accessory: Accessory) {
    await this.softRemove(accessory);
  }

  async getAccessoryCollection(id: number): Promise<Accessory[]> {
    console.log(id);
    const accessoryCollection = this.find({ where: { user: { id: id } } });
    return accessoryCollection;
  }
}
