import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
