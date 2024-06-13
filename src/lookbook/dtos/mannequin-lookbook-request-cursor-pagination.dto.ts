import { ParseArrayPipe, UsePipes } from '@nestjs/common';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class MannequinLookBookRequestCursorPaginationDto {
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
    - 로딩하려는 마네킹룩북의 id = cursor값으로 전송, 이후에는 백엔드에서 수신받은 cursor값으로 요청.
    `,
  })
  @Type(() => Number)
  //피드 미리보기의 경우 첫 요청은 커서 값이 없음.
  @IsInt()
  @IsOptional()
  cursor?: number = 0;
}
