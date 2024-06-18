import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TopRepository } from 'src/repositories/tops.repository';
import { UploadClothDto } from './dtos/upload-cloth.dto';
import { Top } from 'src/entities/clothes/tops.entity';
import { UserTopSaveRepository } from 'src/repositories/user-top-save.repository';
import { UserTopSave } from 'src/entities/save-clothes/user-top-save.entity';

@Injectable()
export class TopService {
  constructor(
    private readonly topRepository: TopRepository,
    private readonly userTopSaveRepository: UserTopSaveRepository,
  ) {}

  async uploadTop(
    s3Url: string,
    userId: number,
    uploadClothDto: UploadClothDto,
  ) {
    return await this.topRepository.uploadTop(s3Url, userId, uploadClothDto);
  }

  async deleteTop(clothId: number, userId: number) {
    const top = await this.topRepository.findTopById(clothId);
    if (!top) {
      throw new NotFoundException('해당 상의가 존재하지 않습니다.');
    }
    //param으로 상의 id를 받아와 삭제하는 것은 보안상 위험이 있으니, 삭제하려는 상의가 해당 유저가 등록한 것이
    //맞는지 확인을 함.
    if (top.userId != userId) {
      throw new UnauthorizedException('해당 상의를 삭제할 권한이 없습니다.');
    }
    await this.topRepository.deleteTop(top);
  }

  async getTopCollection(userId: number): Promise<Partial<Top>[]> {
    const topCollection = await this.topRepository.getTopCollection(userId);
    const urlTopCollection = topCollection.map((top) => ({
      id: top.id,
      url: top.url,
    }));
    return urlTopCollection;
  }

  async getClippedTopCollection(userId: number): Promise<Partial<Top>[]> {
    const clippedTopCollection =
      await this.userTopSaveRepository.getClippedTopCollection(userId);
    const urlClippedTopCollection = clippedTopCollection.map((userTopSave) => ({
      id: userTopSave.top.id,
      url: userTopSave.top.url,
    }));
    return urlClippedTopCollection;
  }

  async getTopDetail(clothId: number): Promise<Top> {
    const top = await this.topRepository.findTopById(clothId);

    if (!top) {
      throw new NotFoundException('해당 상의가 존재하지 않습니다.');
    }

    return top;
  }

  async clipTop(clothId: number, userId: number) {
    const userTopSave = await this.userTopSaveRepository.clippedOrNot(
      clothId,
      userId,
    );
    //찜 해제하기
    if (userTopSave) {
      return await this.userTopSaveRepository.notClipTop(userTopSave);
    }

    const top = await this.topRepository.findTopById(clothId);
    if (!top) {
      throw new NotFoundException('해당 상의가 존재하지 않습니다.');
    }
    return await this.userTopSaveRepository.clipTop(clothId, userId);
  }

  async clippedOrNot(clothId: number, userId: number): Promise<UserTopSave> {
    const userTopSave = await this.userTopSaveRepository.clippedOrNot(
      clothId,
      userId,
    );
    return userTopSave;
  }
}
