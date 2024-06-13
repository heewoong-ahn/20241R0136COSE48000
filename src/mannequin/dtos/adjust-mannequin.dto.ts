import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdjustMannequinDto {
  @ApiProperty({ description: '0: 남자, 1:여자' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  sex: number;

  @ApiProperty({ description: '0 부터 시작하는 index' })
  @IsNotEmpty()
  @IsInt()
  hair: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  skinColor: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(1)))
  height: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(1)))
  body: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(1)))
  arm: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(parseFloat(value).toFixed(1)))
  leg: number;
}
