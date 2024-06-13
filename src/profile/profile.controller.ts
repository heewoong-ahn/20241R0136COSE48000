import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import {
  OtherUserProfileResponseDto,
  myProfileResponseDto,
} from './dtos/profile-response-dto';

@Controller('profile')
@ApiTags('프로필 정보 api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @CustomAuthDecorator(
    200,
    '다른 유저 프로필 정보 가져오기 성공',
    '다른 유저 프로필 정보 가져오기 작업',
  )
  @Get('/other/:userUUID')
  async getOtherUserProfile(
    @Param('userUUID') userUUID: string,
    @Req() req,
  ): Promise<OtherUserProfileResponseDto> {
    return await this.profileService.getOtherUserProfile(userUUID, req.user.id);
  }

  @CustomAuthDecorator(
    200,
    '내 프로필 정보 가져오기 성공',
    '내 프로필 정보 가져오기 작업',
  )
  @Get('/me')
  async getMyProfile(@Req() req): Promise<myProfileResponseDto> {
    return await this.profileService.getMyProfile(req.user.id);
  }
}
