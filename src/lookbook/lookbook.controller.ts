import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  Put,
  Get,
  HttpCode,
  Delete,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ParseArrayPipe,
} from '@nestjs/common';
import { SaveLookBookDto } from './dtos/save-lookbook.dto';
import { LookbookService } from './lookbook.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('lookbook')
@ApiTags('룩북 작업 api')
export class LookbookController {
  constructor(private readonly lookbookService: LookbookService) {}

  @CustomAuthDecorator(201, '룩북 생성 성공', '룩북 저장 작업')
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async saveLookBook(
    @UploadedFile() file: Express.Multer.File,
    @Body() saveLookBookDto: SaveLookBookDto,
    @Req() req,
  ) {
    return await this.lookbookService.saveLookBook(
      file,
      saveLookBookDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(204, '마네킹-룩북 삭제 성공', '마네킹-룩북 삭제 작업')
  @HttpCode(204)
  @Delete('/:mannequinLookBookId')
  async deleteMannequinLookBook(
    @Param('mannequinLookBookId') mannequinLookBookId: number,
    @Req() req,
  ) {
    return await this.lookbookService.deleteMannequinLookBook(
      mannequinLookBookId,
      req.user.id,
    );
  }

  @CustomAuthDecorator(204, '룩북 삭제 성공', '룩북 삭제 작업')
  @HttpCode(204)
  @Delete('/:lookbookId')
  async deleteLookBook(@Param('lookbookId') lookbookId: number, @Req() req) {
    return await this.lookbookService.deleteLookBook(lookbookId, req.user.id);
  }

  @CustomAuthDecorator(200, '룩북 공개/비공개 성공', '룩북 공개/비공개 작업')
  @Put('/show/:lookbookId')
  async showNotShow(@Req() req, @Param('lookbookId') lookbookId: number) {
    return await this.lookbookService.showNotShow(lookbookId, req.user.id);
  }

  @CustomAuthDecorator(200, '룩북 찜/찜해제 성공', '룩북 찜/찜해제 작업')
  @Put('/clip/:lookbookId')
  async clipNotClip(@Req() req, @Param('lookbookId') lookbookId: number) {
    return await this.lookbookService.clipNotClip(lookbookId, req.user.id);
  }

  @CustomAuthDecorator(
    200,
    '룩북 좋아요/좋아요해제 성공',
    '룩북 좋아요/좋아요해제 작업',
  )
  @Put('/like/:lookbookId')
  async likeNotLike(@Req() req, @Param('lookbookId') lookbookId: number) {
    return await this.lookbookService.likeNotLike(lookbookId, req.user.id);
  }
}
