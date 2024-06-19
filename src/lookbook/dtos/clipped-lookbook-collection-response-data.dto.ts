import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
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
class ClippedLookBookResponseDataTransformClass
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
    this.lookbookId = item.lookbook.id;
    this.tops = {
      urls: item.lookbook.topLookBooks.map(
        (topLookBook) => topLookBook.top.url,
      ),
    };
    this.accessories = {
      urls: item.lookbook.accessoryLookBooks.map(
        (accessoryLookBook) => accessoryLookBook.accessory.url,
      ),
    };
    this.pant = { url: item.lookbook.pant.url };
    this.shoe = { url: item.lookbook.shoe.url };
  }
}

export class ClippedLookBookCollectionResponseDataDto {
  //type에 interace는 들어가지 못함.
  @ApiProperty({ type: [ClippedLookBookResponseDataTransformClass] })
  @IsArray()
  readonly clippedLookBookCollection: LookBookCollectionDataTransform[];

  constructor(data: any[]) {
    // this.lookBookCollection = transformData(data);

    this.clippedLookBookCollection = data.map(
      (item) => new ClippedLookBookResponseDataTransformClass(item),
    );
  }
}
