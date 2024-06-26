import { ParseArrayPipe, UsePipes } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { LookBookResponseCursorPaginationMetaDto } from './lookbook-response-curson-pagination-meta.dto';
import { LookBookCollectionDataTransform } from 'src/commons/interfaces/lookbook-collection-data-response.interface';

class UrlCollection {
  @ApiProperty({ type: [String] })
  @IsArray()
  urls: string[];
}

class UrlUni {
  @ApiProperty()
  url: string;
}

//ApiProperty적용 시키기 위해 interface를 class에서 초기화해줌.
class LookBookResponseDataTransformClass
  implements LookBookCollectionDataTransform
{
  @ApiProperty()
  lookbookId: number;

  @ApiProperty({ type: UrlCollection })
  tops: UrlCollection;

  @ApiProperty({ type: UrlCollection })
  accessories: UrlCollection;

  @ApiProperty()
  pant: UrlUni;

  @ApiProperty()
  shoe: UrlUni;

  constructor(item: any) {
    this.lookbookId = item.id;
    this.tops = {
      urls: item.topLookBooks.map((topLookBook) => topLookBook.top.url),
    };
    this.accessories = {
      urls: item.accessoryLookBooks.map(
        (accessoryLookBook) => accessoryLookBook.accessory.url,
      ),
    };
    this.pant = { url: item.pant.url };
    this.shoe = { url: item.shoe.url };
  }
}

export class LookBookCollectionResponseDataDto {
  //type에 interace는 들어가지 못함.
  @ApiProperty({ type: [LookBookResponseDataTransformClass] })
  @IsArray()
  readonly lookBookCollection: LookBookCollectionDataTransform[];

  @ApiProperty()
  readonly cursorPaginationMetaData: LookBookResponseCursorPaginationMetaDto;

  constructor(data: any[], meta: LookBookResponseCursorPaginationMetaDto) {
    // this.lookBookCollection = transformData(data);

    this.lookBookCollection = data.map(
      (item) => new LookBookResponseDataTransformClass(item),
    );
    this.cursorPaginationMetaData = meta;
  }
}
