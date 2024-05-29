import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TopRepository } from 'src/repositories/tops.repository';
import { S3Service } from 'src/s3/s3.service';
import { UploadClothDto } from './dtos/upload-cloth.dto';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { Top } from 'src/entities/clothes/tops.entity';
import { UserTopSaveRepository } from 'src/repositories/user-top-save.repository';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { ResponseClothDto } from './dtos/response-cloth.dto';
import { TopService } from './tops.service';
import { PantService } from './pants.service';
import { ShoeService } from './shoes.service';
import { AccessoryService } from './accessories.service';

@Injectable()
export class ClothService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly topService: TopService,
    private readonly pantService: PantService,
    private readonly shoeService: ShoeService,
    private readonly accessoryService: AccessoryService,
  ) {}

  async uploadCloth(
    category: ClothCategory,
    file: Express.Multer.File,
    uploadClothDto: UploadClothDto,
    userId: number,
  ) {
    const url = await this.s3Service.uploadFile(file, category);

    if (category == ClothCategory.tops) {
      return await this.topService.uploadTop(url, userId, uploadClothDto);
    } else if (category == ClothCategory.pants) {
      return await this.pantService.uploadPant(url, userId, uploadClothDto);
    } else if (category == ClothCategory.shoes) {
      return await this.shoeService.uploadShoe(url, userId, uploadClothDto);
    } else if (category == ClothCategory.accessories) {
      return await this.accessoryService.uploadAccessory(
        url,
        userId,
        uploadClothDto,
      );
    } else {
      throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
  }

  async deleteCloth(category: ClothCategory, clothId: number, userId: number) {
    switch (category) {
      case ClothCategory.tops:
        return await this.topService.deleteTop(clothId, userId);
      case ClothCategory.pants:
        return await this.pantService.deletePant(clothId, userId);
      case ClothCategory.shoes:
        return await this.shoeService.deleteShoe(clothId, userId);
      case ClothCategory.accessories:
        return await this.accessoryService.deleteAccessory(clothId, userId);
      default:
        throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
  }

  async getClothCollection(
    category: ClothCategory,
    id: number,
  ): Promise<
    Partial<Top>[] | Partial<Pant>[] | Partial<Shoe>[] | Partial<Accessory>[]
  > {
    switch (category) {
      case ClothCategory.tops:
        return await this.topService.getTopCollection(id);
      case ClothCategory.pants:
        return await this.pantService.getPantCollection(id);
      case ClothCategory.shoes:
        return await this.shoeService.getShoeCollection(id);
      case ClothCategory.accessories:
        return await this.accessoryService.getAccessoryCollection(id);
      default:
        throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
  }

  async getClothDetail(
    category: ClothCategory,
    id: number,
  ): Promise<ResponseClothDto> {
    switch (category) {
      case ClothCategory.tops:
        return new ResponseClothDto(
          await this.topService.getTopDetail(id),
          ClothCategory.tops,
        );
      case ClothCategory.pants:
        return new ResponseClothDto(
          await this.pantService.getPantDetail(id),
          ClothCategory.pants,
        );
      case ClothCategory.shoes:
        return new ResponseClothDto(
          await this.shoeService.getShoeDetail(id),
          ClothCategory.shoes,
        );
      case ClothCategory.accessories:
        return new ResponseClothDto(
          await this.accessoryService.getAccessoryDetail(id),
          ClothCategory.accessories,
        );
      default:
        throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
  }

  async clipCloth(category: string, clothId: number, userId: number) {
    switch (category) {
      case ClothCategory.tops:
        return this.topService.clipTop(clothId, userId);
      case ClothCategory.pants:
        return this.pantService.clipPant(clothId, userId);
      case ClothCategory.shoes:
        return this.shoeService.clipShoe(clothId, userId);
      case ClothCategory.accessories:
        return this.accessoryService.clipAccessory(clothId, userId);
      default:
        throw new BadRequestException('해당 카테고리가 존재하지 않습니다.');
    }
  }
}
