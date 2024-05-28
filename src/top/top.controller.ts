import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { TopService } from './top.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('tops')
@ApiTags('상의 사진 관련 api')
export class TopController {
  constructor(private readonly topService: TopService) {}

  @Post('/upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '상의 사진 파일 업로드',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadTop(@UploadedFile() file: Express.Multer.File) {
    return this.topService.uploadTop(file);
  }
}
