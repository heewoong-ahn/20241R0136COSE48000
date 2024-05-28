import { Controller, Put, Body, UseGuards, Req, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MannequinService } from './mannequin.service';
import { AdjustMannequinDto } from './dtos/adjust-mannequin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('mannequin')
@ApiTags('마네킹 수정 API')
export class MannequinController {
  constructor(private readonly mannequinService: MannequinService) {}

  @UseGuards(AuthGuard('access'))
  @Put('/me')
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 200, description: '마네킹 수정 성공' })
  @ApiOperation({
    summary: '마네킹 수정',
  })
  async adjustMannequin(
    @Body() adjustMannequinDto: AdjustMannequinDto,
    @Req() req,
  ) {
    return this.mannequinService.adjustMannequin(
      adjustMannequinDto,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('access'))
  @Get('/me')
  @ApiBearerAuth('Access Token')
  @ApiResponse({ status: 200, description: '마네킹 정보 반환 성공' })
  @ApiOperation({
    summary: '마네킹 정보 반환',
  })
  async getMannequin(@Req() req) {
    return this.mannequinService.getMannequin(req.user.id);
  }
}
