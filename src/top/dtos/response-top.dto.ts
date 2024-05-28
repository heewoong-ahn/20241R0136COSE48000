import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Top } from 'src/entities/clothes/tops.entity';

export class ResponseTopDto {
  @ApiProperty()
  @IsNotEmpty()
  URL: string;

  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsOptional()
  memo?: string;

  constructor(top: Top) {
    this.URL = top.url;
    this.type = top.type;
    this.memo = top.memo;
  }
}
