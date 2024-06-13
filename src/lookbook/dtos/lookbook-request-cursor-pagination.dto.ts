import { ParseArrayPipe, UsePipes } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LookBookRequestCursorPaginationDto {
  @ApiProperty({
    example: 1,
    description:
      '한번에 불러올 feed 개수: 첫 로딩 때만 자연스러운 화면 전환을 위해 take*2개의 데이터를 반환. 피드에 경우 1로 고정.',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  take: number;

  @ApiProperty({
    description: `다음 요청에 쓰일 커서값,
    피드: 
    - 로딩하려는 룩북의 id = cursor값으로 전송, 이후에는 백엔드에서 수신받은 cursor값으로 요청.
    검색창: 
    - 데이터 첫 로딩때만 값을 지정해 주지 않음, 이후에는 백엔드에서 수신받은 cursor값으로 요청.
    - 검색 단어를 바꿀 때도 cursor값은 빈 값으로 초기화 되어야 함.
    `,
  })
  @Type(() => Number)
  //검색 창의 경우 첫 요청은 커서 값이 없음.
  @IsInt()
  @IsOptional()
  cursor?: number = 0;

  @ApiProperty({ description: '필터링 할 단어' })
  @IsOptional()
  @IsString()
  keyword?: string | undefined;
}
