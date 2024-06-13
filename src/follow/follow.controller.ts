import {
  Controller,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import { FollowService } from './follow.service';

@Controller('follow')
@ApiTags('팔로우 작업 api')
export class FollowController {
  constructor(private readonly followService: FollowService) {}
  @CustomAuthDecorator(
    201,
    '팔로우/팔로우 취소 성공',
    '팔로우/팔로우 취소 작업',
  )
  @ApiQuery({
    name: 'userUUID',
    description: '팔로우/ 팔로우 취소 하려는 유저의 id',
  })
  @HttpCode(201)
  @Put('/:userUUID')
  async followNotFollow(@Query('userUUID') userUUID: string, @Req() req) {
    return await this.followService.followNotFollow(userUUID, req.user.id);
  }

  @CustomAuthDecorator(
    200,
    '팔로워 목록 가져오기 성공',
    '팔로워 목록 가져오는 작업',
  )
  @Get('/list/follower/:userUUID')
  async getFollowerList(
    @Param('userUUID') userUUID: string,
  ): Promise<string[]> {
    return await this.followService.getFollowerList(userUUID);
  }

  @CustomAuthDecorator(
    200,
    '팔로우 목록 가져오기 성공',
    '팔로우 목록 가져오는 작업',
  )
  @Get('/list/following/:userUUID')
  async getFollowingList(
    @Param('userUUID') userUUID: string,
  ): Promise<string[]> {
    return await this.followService.getFollowingList(userUUID);
  }
}
