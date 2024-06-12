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

export class LookBookCollectionResponseMetaDto {
  @ApiProperty({ example: 9 })
  @IsNotEmpty()
  @IsInt()
  take: number;

  @ApiProperty({ example: 9 })
  //첫 요청은 커서 값이 없음.
  @IsInt()
  cursor: number;

  @ApiProperty({ example: 'true' })
  @IsBoolean()
  hasNext: boolean;
}
