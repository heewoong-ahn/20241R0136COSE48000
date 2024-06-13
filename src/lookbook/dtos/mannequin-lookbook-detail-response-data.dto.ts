import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString } from 'class-validator';
import { LookBookResponseCursorPaginationMetaDto } from './lookbook-response-curson-pagination-meta.dto';

class MannequinLookBookDetailData {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: '~~~/~~~~/~~.png' })
  @IsString()
  url: string;

  @ApiProperty({ example: '제목' })
  @IsString()
  title: string;

  @ApiProperty({ example: '{스트릿, 캐쥬얼}' })
  @IsString()
  @IsArray()
  type: string[];

  @ApiProperty({ example: '메모' })
  @IsString()
  memo?: string | null;

  constructor(item: any) {
    (this.id = item.id),
      (this.url = item.url),
      (this.title = item.title),
      (this.type = item.type),
      (this.memo = item.memo);
  }
}

export class MannequinLookBookDetailResponseData {
  @ApiProperty({ type: [MannequinLookBookDetailData] })
  @IsArray()
  readonly mannequinLookBookDetail: MannequinLookBookDetailData[];

  @ApiProperty()
  readonly cursorPaginationMetaData: LookBookResponseCursorPaginationMetaDto;

  constructor(data: any[], meta: LookBookResponseCursorPaginationMetaDto) {
    this.mannequinLookBookDetail = data.map(
      (item) => new MannequinLookBookDetailData(item),
    );
    this.cursorPaginationMetaData = meta;
  }
}
