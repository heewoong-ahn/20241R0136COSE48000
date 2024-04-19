import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Req,
  Delete,
  Put,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiProperty,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendEmailDto } from './dtos/send-email-dto';
import { CreateUserDto } from './dtos/create-user-dto';
import { LoginDto } from './dtos/login-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('유저 회원가입 및 인증 API')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // //회원가입 인증 이메일 전송 로직
  // @Post('/email')
  // @ApiResponse({ status: 201, description: '인증번호, 유효기간 5분' })
  // @ApiOperation({
  //   summary: '이메일로 회원가입 인증번호 발송.',
  // })
  // async sendEmailAuth(@Body() body: SendEmailDto) {
  //   return await this.authService.sendEmailAuth(body.email);
  // }

  @Post('/create-user')
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiOperation({
    summary: '회원가입',
  })
  async createUser(@Body() body: CreateUserDto) {
    return await this.authService.createUser(body);
  }

  @Post('/login')
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @ApiOperation({
    summary: '로그인',
    description: 'AccessToken && RefreshToken반환\n각 유효기간 2h, 2w',
  })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @UseGuards(AuthGuard('access'))
  @Delete('/delete-user')
  //스웨거에서 header에 Access Token 담아서 보낸 것을 받기 위함.
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 201, description: '회원 탈퇴 성공' })
  @ApiOperation({
    summary: '회원탈퇴',
  })
  async deleteUser(@Req() req) {
    return await this.authService.deleteUser(req.id);
  }

  @UseGuards(AuthGuard('refresh'))
  @Get('/new-access-token')
  @ApiBearerAuth('Refresh Token')
  @ApiResponse({ status: 201, description: 'Access Token 재발급 성공' })
  @ApiOperation({
    summary: 'Access Token 재발급',
  })
  restoreAccessToken(@Req() req) {
    return this.authService.newAccessToken(req.id);
  }
}
