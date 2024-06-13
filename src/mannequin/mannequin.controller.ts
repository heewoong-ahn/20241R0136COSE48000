import { Controller, Put, Body, Req, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MannequinService } from './mannequin.service';
import { AdjustMannequinDto } from './dtos/adjust-mannequin.dto';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import { Mannequin } from 'src/entities/mannequins.entity';

@Controller('mannequin')
@ApiTags('마네킹 수정 API')
export class MannequinController {
  constructor(private readonly mannequinService: MannequinService) {}

  @CustomAuthDecorator(
    200,
    '마네킹 수정 성공',
    '마네킹 수정: index는 0부터 시작하고 남자는 =0 여자는 =1',
  )
  @Put('/me')
  async adjustMannequin(
    @Body() adjustMannequinDto: AdjustMannequinDto,
    @Req() req,
  ) {
    return this.mannequinService.adjustMannequin(
      adjustMannequinDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(200, '마네킹 정보 반환 성공', '마네킹 정보 반환')
  @ApiResponse({
    type: Mannequin,
  })
  @Get('/me')
  async getMannequin(@Req() req) {
    return this.mannequinService.getMannequin(req.user.id);
  }
}
