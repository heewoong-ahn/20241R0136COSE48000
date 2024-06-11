import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user-dto';
import { LoginDto } from './dtos/login-dto';
import { AuthGuard } from '@nestjs/passport';
import { checkDuplicateLoginId } from './dtos/check-duplicate-loginId-dto';
import { LoginResponseDto } from './dtos/login-response-dto';
import { NewAccessResponseDto } from './dtos/new-access-response-dto';

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

  //body를 통한 get요청은 불가함.
  //그냥 '/:loginId'로 하게 되면 /~~인 모든 route를 가로채게 됨.
  @Get('/duplicate/:loginId')
  @ApiResponse({ status: 201, description: '중복되는 아이디 존재하지 않음.' })
  @ApiOperation({
    summary: 'loginId 중복 체크',
  })
  async checkDuplicateLoginId(@Param() loginId: checkDuplicateLoginId) {
    return await this.authService.checkDuplicateLoginId(loginId);
  }

  @Post('/login')
  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiOperation({
    summary: '로그인',
    description: 'AccessToken && RefreshToken반환\n각 유효기간 1h, 2w',
  })
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  //일단 회원도 soft delete
  @UseGuards(AuthGuard('access'))
  @Delete('/delete-user')
  //스웨거에서 header에 Access Token 담아서 보낸 것을 받기 위함.
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 200, description: '회원 탈퇴 성공' })
  @ApiOperation({
    summary: '회원탈퇴',
  })
  async deleteUser(@Req() req) {
    return await this.authService.deleteUser(req.user.id);
  }

  @UseGuards(AuthGuard('refresh'))
  @Get('/new-access-token')
  @ApiBearerAuth('Refresh Token')
  @ApiResponse({
    status: 201,
    description: 'Access Token 재발급 성공',
    type: NewAccessResponseDto,
  })
  @ApiOperation({
    summary: 'Access Token 재발급',
  })
  //header 값 가져오는 데코레이터
  //header에 authorization 필드가 인증 정보를 가지고 있음.
  restoreAccessToken(@Req() req) {
    return this.authService.newAccessToken(
      //passport 인증은 jwt에서 추출한 정보를 user 속성에 담는다!!!
      req.user.id,
      req.headers.authorization.substring(7),
    );
  }
}
