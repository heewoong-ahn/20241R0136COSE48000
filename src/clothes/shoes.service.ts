import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UploadClothDto } from './dtos/upload-cloth.dto';
import { ShoeRepository } from 'src/repositories/shoes.repository';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { UserShoeSaveRepository } from 'src/repositories/user-shoe-save.repository';
import { UserShoeSave } from 'src/entities/save-clothes/user-shoe-save.entity';

@Injectable()
export class ShoeService {
  constructor(
    private readonly shoeRepository: ShoeRepository,
    private readonly userShoeSaveRepository: UserShoeSaveRepository,
  ) {}

  async uploadShoe(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ) {
    return await this.shoeRepository.uploadShoe(s3Url, userId, uploadClothDto);
  }
  async deleteShoe(clothId: number, userId: number) {
    const shoe = await this.shoeRepository.findShoeById(clothId);
    if (!shoe) {
      throw new NotFoundException('해당 신발이 존재하지 않습니다.');
    }
    if (shoe.userId != userId) {
      throw new UnauthorizedException('해당 신발을 삭제할 권한이 없습니다.');
    }
    await this.shoeRepository.deleteShoe(shoe);
  }

  async getShoeCollection(userId: number): Promise<Partial<Shoe>[]> {
    const shoeCollection = await this.shoeRepository.getShoeCollection(userId);
    const urlShoeCollection = shoeCollection.map((shoe) => ({
      id: shoe.id,
      url: shoe.url,
    }));
    return urlShoeCollection;
  }

  async getShoeDetail(clothId: number): Promise<Shoe> {
    const shoe = await this.shoeRepository.findShoeById(clothId);

    if (!shoe) {
      throw new NotFoundException('해당 신발이 존재하지 않습니다.');
    }

    return shoe;
  }

  async clipShoe(clothId: number, userId: number) {
    const userShoeSave = await this.userShoeSaveRepository.clippedOrNot(
      clothId,
      userId,
    );
    //찜 해제하기
    if (userShoeSave) {
      return await this.userShoeSaveRepository.notClipShoe(userShoeSave);
    }

    const shoe = await this.shoeRepository.findShoeById(clothId);
    if (!shoe) {
      throw new NotFoundException('해당 신발이 존재하지 않습니다.');
    }
    return await this.userShoeSaveRepository.clipShoe(clothId, userId);
  }

  async clippedOrNot(clothId: number, userId: number): Promise<UserShoeSave> {
    const userShoeSave = await this.userShoeSaveRepository.clippedOrNot(
      clothId,
      userId,
    );
    return userShoeSave;
  }
}
