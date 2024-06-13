import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { LookBookResponseCursorPaginationMetaDto } from './lookbook-response-curson-pagination-meta.dto';

class MannequinLookBookCollectionData {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: '~~~/~~~~/~~.png' })
  @IsString()
  url: string;

  constructor(item: any) {
    this.id = item.id;
    this.url = item.url;
  }
}
export class MannequinLookBookCollectionResponseData {
  @ApiProperty({ type: [MannequinLookBookCollectionData] })
  @IsArray()
  readonly mannequinLookBookCollection: MannequinLookBookCollectionData[];

  @ApiProperty()
  readonly cursorPaginationMetaData: LookBookResponseCursorPaginationMetaDto;

  constructor(data: any[], meta: LookBookResponseCursorPaginationMetaDto) {
    this.mannequinLookBookCollection = data.map(
      (item) => new MannequinLookBookCollectionData(item),
    );
    this.cursorPaginationMetaData = meta;
  }
}
