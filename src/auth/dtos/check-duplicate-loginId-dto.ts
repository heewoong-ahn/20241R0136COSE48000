import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class checkDuplicateLoginId {
  @ApiProperty()
  @IsNotEmpty()
  loginId: string;
}
