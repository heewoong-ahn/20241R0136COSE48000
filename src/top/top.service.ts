import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TopRepository } from 'src/repositories/tops.repository';
import { S3Service } from 'src/s3/s3.service';
import { UploadTopDto } from './dtos/upload-top.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { map } from 'rxjs';
import { Top } from 'src/entities/clothes/tops.entity';
import { ResponseTopDto } from './dtos/response-top.dto';

@Injectable()
export class TopService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly topRepository: TopRepository,
  ) {}

  async uploadTop(
    file: Express.Multer.File,
    uploadTopDto: UploadTopDto,
    userId: number,
  ) {
    const url = await this.s3Service.uploadFile(file, ClothCategory.tops);
    return await this.topRepository.uploadTop(url, userId, uploadTopDto);
  }

  async deleteTop(topId: number, userId: number) {
    const top = await this.topRepository.findTopById(topId);
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

  async getTopCollection(id: number): Promise<Partial<Top>[]> {
    const topCollection = await this.topRepository.getTopCollecion(id);
    const urlTopCollection = topCollection.map((top) => ({
      id: top.id,
      url: top.url,
    }));
    return urlTopCollection;
  }

  async getTopDetail(id: number): Promise<ResponseTopDto> {
    const top = await this.topRepository.findTopById(id);

    if (!top) {
      throw new NotFoundException('해당 상의가 존재하지 않습니다.');
    }

    return new ResponseTopDto(top);
  }
}
