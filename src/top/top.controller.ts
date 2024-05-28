import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  UseGuards,
  Req,
  Body,
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
  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  //file은 UploadedFile()로 받아야지만 값이 제대로 담긴다.
  @UseInterceptors(FileInterceptor('file'))
  async uploadTop(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadTopDto: UploadTopDto,
    @Req() req,
  ) {
    return this.topService.uploadTop(file, uploadTopDto, req.user.id);
  }
}
