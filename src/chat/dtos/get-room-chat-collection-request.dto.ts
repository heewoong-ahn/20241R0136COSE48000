import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class GetRoomChatCollectionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number) //multipart-form data뿐만아니라 param()으로 받는 것은 기본 string으로 설정되는듯.
  @IsInt()
  chatRoomId: number;
}
