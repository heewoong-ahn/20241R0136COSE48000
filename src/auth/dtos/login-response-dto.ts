import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: '로그인 성공', description: '응답 메시지' })
  message: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ description: '액세스 토큰' })
  AccessToken: string;

  @ApiProperty({ description: '리프레시 토큰' })
  RefreshToken: string;
}
