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
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(1)
  sex: string;

  @ApiProperty()
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
