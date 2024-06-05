import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LookBookRepository } from 'src/repositories/lookbooks.repository';
import { SaveLookBookDto } from './dtos/save-lookbook.dto';
import { TopLookBookRepository } from 'src/repositories/top-lookbooks.repository';
import { AccessoryLookBookRepository } from 'src/repositories/accessory-lookbooks.repository';
import { Top } from 'src/entities/clothes/tops.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';

@Injectable()
export class LookbookService {
  constructor(
    private readonly lookBookRepository: LookBookRepository,
    private readonly topLookBookRepository: TopLookBookRepository,
    private readonly accessoryLookBookRepository: AccessoryLookBookRepository,
  ) {}

  async saveLookBook(saveLookBookDto: SaveLookBookDto, userId: number) {
    const { topIds, accessoryIds, pantId, shoeId, ...saveLookbookData } =
      saveLookBookDto;

    const lookbook = await this.lookBookRepository.saveLookBook(
      saveLookbookData,
      userId,
      pantId,
      shoeId,
    );

    topIds.map(async (topId) => {
      const top = new Top();
      top.id = topId;

      await this.topLookBookRepository.topToLookbook(top, lookbook);
    });

    accessoryIds.map(async (accessoryId) => {
      const accessory = new Accessory();
      accessory.id = accessoryId;

      await this.accessoryLookBookRepository.accessoryToLookbook(
        accessory,
        lookbook,
      );
    });
    return;
  }

  async showNotShow(lookbookId: number, userId: number) {
    //변경을 원하는 lookbook의 소유가 자신의 것인지 확인 후 작업
    const lookBook = await this.lookBookRepository.findLookBookById(lookbookId);
    if (!lookBook) {
      throw new NotFoundException('해당 룩북이 존재하지 않습니다.');
    }
    if (!(lookBook.userId == userId)) {
      throw new UnauthorizedException(
        '다른 계정의 룩북에 대한 접근으로 권한이 없습니다.',
      );
    }
    return await this.lookBookRepository.showNotShow(lookBook);
  }
}
