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

export class SaveLookBookDto {
  @ApiProperty({ type: [Number] }) //입력 데이터 명시
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(Number); // 이미 배열인 경우 각 요소를 숫자로 변환
    } else if (typeof value === 'string') {
      return value.split(',').map(Number); // 문자열인 경우 쉼표로 분리하여 배열로 변환
    }
    return [];
  })
  @IsNotEmpty({ each: true })
  @IsInt({ each: true }) //run time 시 유효성 확인
  @IsArray()
  topIds: number[];

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  pantId: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  shoeId: number;

  @ApiProperty({ type: [Number] })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(Number); // 이미 배열인 경우 각 요소를 숫자로 변환
    } else if (typeof value === 'string') {
      return value.split(',').map(Number); // 문자열인 경우 쉼표로 분리하여 배열로 변환
    }
    return [];
  })
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  @IsArray()
  accessoryIds: number[];

  @ApiProperty()
  @Type(() => Boolean)
  @IsNotEmpty()
  @IsBoolean()
  show: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: [String] })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value; // 이미 배열인 경우 그대로 반환
    } else if (typeof value === 'string') {
      return value.split(','); // 문자열인 경우 쉼표로 분리하여 배열로 변환 후 반환
    }
    return [];
  })
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  type: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memo: string;

  @ApiProperty({ type: 'string', format: 'binary' }) // 파일을 나타내는 ApiProperty
  file: Express.Multer.File; // Express.Multer.File 타입의 file 필드
}

export class SaveLookBookWithoutClothIdDto extends PickType(SaveLookBookDto, [
  'show',
  'title',
  'type',
  'memo',
]) {}
