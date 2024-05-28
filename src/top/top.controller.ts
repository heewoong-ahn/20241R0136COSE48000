import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  Req,
  Body,
  Delete,
  Param,
  HttpCode,
  Get,
} from '@nestjs/common';
import { TopService } from './top.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UploadTopDto } from './dtos/upload-top.dto';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';

@Controller('tops')
@ApiTags('상의 사진 관련 api')
export class TopController {
  constructor(private readonly topService: TopService) {}

  @CustomAuthDecorator(200, '파일 업로드 성공', '상의 사진 파일 업로드 작업')
  @Post()
  @ApiConsumes('multipart/form-data')
  //file은 UploadedFile()로 받아야지만 값이 제대로 담긴다.
  @UseInterceptors(FileInterceptor('file'))
  async uploadTop(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadTopDto: UploadTopDto,
    @Req() req,
  ) {
    return await this.topService.uploadTop(file, uploadTopDto, req.user.id);
  }

  @CustomAuthDecorator(200, '상의 불러오기 성공', '사용자 모든 상의 불러오기')
  @Get()
  async getTopCollection(@Req() req) {
    return await this.topService.getTopCollection(req.user.id);
  }

  @CustomAuthDecorator(204, '파일 삭제 성공', '상의 사진 파일 삭제 작업')
  @HttpCode(204)
  @Delete('/:id')
  async deleteTop(@Param('id') id: number, @Req() req) {
    await this.topService.deleteTop(id, req.user.id);
  }

  @CustomAuthDecorator(
    200,
    '해당 상의 상세정보 불러오기 성공',
    '선택된 상의의 상세 정보 불러오기',
  )
  @Get('/:id')
  async getTopDetail(@Param('id') id: number) {
    return await this.topService.getTopDetail(id);
  }
}
