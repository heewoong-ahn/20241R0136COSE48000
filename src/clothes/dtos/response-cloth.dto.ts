import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { Top } from 'src/entities/clothes/tops.entity';

export class ResponseClothDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: ClothCategory.tops })
  @IsNotEmpty()
  category: ClothCategory;

  @ApiProperty()
  @IsNotEmpty()
  URL: string;

  @ApiProperty({ example: '반팔' })
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsOptional()
  memo?: string;

  @ApiProperty({ description: '옷 저장 여부 알리는 metric' })
  @IsNotEmpty()
  save: boolean;

  constructor(
    cloth: Top | Pant | Shoe | Accessory,
    category: ClothCategory,
    save: boolean,
  ) {
    this.id = cloth.id;
    this.URL = cloth.url;
    this.type = cloth.type;
    this.memo = cloth.memo;
    this.category = category;
    this.save = save;
  }
}

export class ResponseClothCollectionDto extends PickType(ResponseClothDto, [
  'id',
  'URL',
] as const) {}
