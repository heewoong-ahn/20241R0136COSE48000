import { ApiProperty } from '@nestjs/swagger';

export class NewAccessResponseDto {
  @ApiProperty({
    example: 'Access Token 재발급 성공',
    description: '응답 메시지',
  })
  message: string;

  @ApiProperty({ description: '액세스 토큰' })
  AccessToken: string;
}
