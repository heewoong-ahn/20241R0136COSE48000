import { Controller, Put, Body, Req, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MannequinService } from './mannequin.service';
import { AdjustMannequinDto } from './dtos/adjust-mannequin.dto';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';

@Controller('mannequin')
@ApiTags('마네킹 수정 API')
export class MannequinController {
  constructor(private readonly mannequinService: MannequinService) {}

  @CustomAuthDecorator(200, '마네킹 수정 성공', '마네킹 수정')
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
  @Get('/me')
  async getMannequin(@Req() req) {
    return this.mannequinService.getMannequin(req.user.id);
  }
}
