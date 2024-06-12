import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UploadClothDto } from './dtos/upload-cloth.dto';
import { PantRepository } from 'src/repositories/pants.repository';
import { Pant } from 'src/entities/clothes/pants.entity';
import { UserPantSaveRepository } from 'src/repositories/user-pant-save.repository';
import { UserPantSave } from 'src/entities/save-clothes/user-pant-save.entity';

@Injectable()
export class PantService {
  constructor(
    private readonly pantRepository: PantRepository,
    private readonly userPantSaveRepository: UserPantSaveRepository,
  ) {}

  async uploadPant(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ) {
    return await this.pantRepository.uploadPant(s3Url, userId, uploadClothDto);
  }

  async deletePant(clothId: number, userId: number) {
    const pant = await this.pantRepository.findPantById(clothId);
    if (!pant) {
      throw new NotFoundException('해당 바지가 존재하지 않습니다.');
    }
    //param으로 상의 id를 받아와 삭제하는 것은 보안상 위험이 있으니, 삭제하려는 상의가 해당 유저가 등록한 것이
    //맞는지 확인을 함.
    if (pant.userId != userId) {
      throw new UnauthorizedException('해당 바지를 삭제할 권한이 없습니다.');
    }
    await this.pantRepository.deletePant(pant);
  }

  async getPantCollection(userId: number): Promise<Partial<Pant>[]> {
    const pantCollection = await this.pantRepository.getPantCollection(userId);
    const urlPantCollection = pantCollection.map((pant) => ({
      id: pant.id,
      url: pant.url,
    }));
    return urlPantCollection;
  }

  async getPantDetail(clothId: number): Promise<Pant> {
    const pant = await this.pantRepository.findPantById(clothId);

    if (!pant) {
      throw new NotFoundException('해당 바지가 존재하지 않습니다.');
    }

    return pant;
  }

  async clipPant(clothId: number, userId: number) {
    const userPantSave = await this.userPantSaveRepository.clippedOrNot(
      clothId,
      userId,
    );
    //찜 해제하기
    if (userPantSave) {
      return await this.userPantSaveRepository.notClipPant(userPantSave);
    }

    const pant = await this.pantRepository.findPantById(clothId);
    if (!pant) {
      throw new NotFoundException('해당 바지가 존재하지 않습니다.');
    }
    return await this.userPantSaveRepository.clipPant(clothId, userId);
  }

  async clippedOrNot(clothId: number, userId: number): Promise<UserPantSave> {
    const userPantSave = await this.userPantSaveRepository.clippedOrNot(
      clothId,
      userId,
    );
    return userPantSave;
  }
}
