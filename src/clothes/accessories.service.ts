import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UploadClothDto } from './dtos/upload-cloth.dto';
import { AccessoryRepository } from 'src/repositories/accessories.repository';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { UserAccessorySaveRepository } from 'src/repositories/user-accessory-save.repository';
import { UserAccessorySave } from 'src/entities/save-clothes/user-accessory-save.entity';

@Injectable()
export class AccessoryService {
  constructor(
    private readonly accessoryRepository: AccessoryRepository,
    private readonly userAccessorySaveRepository: UserAccessorySaveRepository,
  ) {}

  async uploadAccessory(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ) {
    return await this.accessoryRepository.uploadAccessory(
      s3Url,
      userId,
      uploadClothDto,
    );
  }

  async deleteAccessory(clothId: number, userId: number) {
    const accessory = await this.accessoryRepository.findAccessoryById(clothId);
    if (!accessory) {
      throw new NotFoundException('해당 악세서리가 존재하지 않습니다.');
    }
    //param으로 상의 id를 받아와 삭제하는 것은 보안상 위험이 있으니, 삭제하려는 상의가 해당 유저가 등록한 것이
    //맞는지 확인을 함.
    if (accessory.userId != userId) {
      throw new UnauthorizedException(
        '해당 악세서리를 삭제할 권한이 없습니다.',
      );
    }
    await this.accessoryRepository.deleteAccessory(accessory);
  }

  async getAccessoryCollection(userId: number): Promise<Partial<Accessory>[]> {
    const accessoryCollection =
      await this.accessoryRepository.getAccessoryCollection(userId);
    const urlAccessoryCollection = accessoryCollection.map((accessory) => ({
      id: accessory.id,
      url: accessory.url,
    }));
    return urlAccessoryCollection;
  }

  async getClippedAccessoryCollection(
    userId: number,
  ): Promise<Partial<Accessory>[]> {
    const clippedAccessoryCollection =
      await this.userAccessorySaveRepository.getClippedAccessoryCollection(
        userId,
      );
    const urlClippedAccessoryCollection = clippedAccessoryCollection.map(
      (userAccessorySave) => ({
        id: userAccessorySave.accessory.id,
        url: userAccessorySave.accessory.url,
      }),
    );
    return urlClippedAccessoryCollection;
  }

  async getAccessoryDetail(clothId: number): Promise<Accessory> {
    const accessory = await this.accessoryRepository.findAccessoryById(clothId);

    if (!accessory) {
      throw new NotFoundException('해당 악세서리가 존재하지 않습니다.');
    }

    return accessory;
  }

  async clipAccessory(clothId: number, userId: number) {
    const userAccessorySave =
      await this.userAccessorySaveRepository.clippedOrNot(clothId, userId);
    console.log(userAccessorySave + 'AAAAAA');
    //찜 해제하기
    if (userAccessorySave) {
      return await this.userAccessorySaveRepository.notClipAccessory(
        userAccessorySave,
      );
    }

    const accessory = await this.accessoryRepository.findAccessoryById(clothId);
    if (!accessory) {
      throw new NotFoundException('해당 악세서리가 존재하지 않습니다.');
    }
    return await this.userAccessorySaveRepository.clipAccessory(
      clothId,
      userId,
    );
  }

  async clippedOrNot(
    clothId: number,
    userId: number,
  ): Promise<UserAccessorySave> {
    const userAccessorySave =
      await this.userAccessorySaveRepository.clippedOrNot(clothId, userId);
    return userAccessorySave;
  }
}
