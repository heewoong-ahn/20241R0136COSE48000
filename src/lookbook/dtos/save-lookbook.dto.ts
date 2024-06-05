import { ApiProperty, PickType } from '@nestjs/swagger';
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
  @IsNotEmpty({ each: true })
  @IsInt({ each: true }) //run time 시 유효성 확인
  @IsArray()
  topIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  pantId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  shoeId: number;

  @ApiProperty({ type: [Number] })
  @IsNotEmpty({ each: true })
  @IsInt({ each: true })
  @IsArray()
  accessoryIds: number[];

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  show: boolean;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty({ each: true })
  @IsString({ each: true })
  @IsArray()
  type: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  memo: string;
}

export class SaveLookBookWithoutClothIdDto extends PickType(SaveLookBookDto, [
  'show',
  'title',
  'type',
  'memo',
]) {}
