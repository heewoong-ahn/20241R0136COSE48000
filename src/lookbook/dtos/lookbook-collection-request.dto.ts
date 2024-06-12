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

export class LookBookCollectionRequestDto {
  @ApiProperty({
    example: 9,
    description:
      '한번에 불러올 feed 개수: 첫 로딩 때만 자연스러운 화면 전환을 위해 take*2개의 데이터를 반환',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  take: number;

  @ApiProperty({
    description:
      '다음 요청에 쓰일 커서값: 데이터 첫 로딩때만 값을 지정해주지 않음. \n검색 단어를 바꿀 때도 cursor값은 빈 값으로 초기화 되어야 함. 응답받은 cursor값을 다음요청에 그대로 쓰면 됨.',
  })
  @Type(() => Number)
  //첫 요청은 커서 값이 없음.
  @IsInt()
  @IsOptional()
  cursor?: number = 0;

  @ApiProperty({ example: '반팔', description: '필터링 할 단어' })
  @IsOptional()
  @IsString()
  keyword?: string | undefined;
}
