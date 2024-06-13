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
  Query,
} from '@nestjs/common';
import { SaveLookBookDto } from './dtos/save-lookbook.dto';
import { LookbookService } from './lookbook.service';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { LookBookRequestCursorPaginationDto } from './dtos/lookbook-request-cursor-pagination.dto';
import { LookBookCollectionResponseDataDto } from './dtos/lookbook-collection-response-data.dto';
import { LookBookDetailResponseDataDto } from './dtos/lookbook-detail-response-data.dto';
import { MannequinLookBookRequestCursorPaginationDto } from './dtos/mannequin-lookbook-request-cursor-pagination.dto';
import { MannequinLookBookCollectionResponseData } from './dtos/mannequin-lookbook-collection-response-data.dto';
import { MannequinLookBookDetailResponseData } from './dtos/mannequin-lookbook-detail-response-data.dto';

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
    console.log(saveLookBookDto.type);
    return await this.lookbookService.saveLookBook(
      file,
      saveLookBookDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(204, '마네킹-룩북 삭제 성공', '마네킹-룩북 삭제 작업')
  @HttpCode(204)
  @Delete('/mannequinLookBook/:mannequinLookBookId')
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

  @CustomAuthDecorator(
    200,
    '룩북 표지들 불러오기 성공',
    '검색창에 뜨는 룩북 표지들 불러오는 작업',
  )
  @Get()
  @ApiResponse({
    type: LookBookCollectionResponseDataDto,
  })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  //Query param은 값을 주지 않으면 undefined가 됨.
  async getLookBookCollection(
    @Query()
    lookBookRequestCursorPaginationDto: LookBookRequestCursorPaginationDto,
    @Req() req,
  ): Promise<LookBookCollectionResponseDataDto> {
    return await this.lookbookService.getLookBookCollection(
      lookBookRequestCursorPaginationDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(
    200,
    '프로필별 룩북 표지들 불러오기 성공',
    '프로필 화면에 뜨는 룩북 표지들 불러오는 작업 !!필터링 할 단어가 있으면 안됨.',
  )
  @Get('/profile/:userUUID')
  @ApiResponse({
    type: LookBookCollectionResponseDataDto,
  })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  //Query param은 값을 주지 않으면 undefined가 됨.
  async getProfileLookBookCollection(
    @Param('userUUID') userUUID: string,
    @Query()
    lookBookRequestCursorPaginationDto: LookBookRequestCursorPaginationDto,
    @Req() req,
  ): Promise<LookBookCollectionResponseDataDto> {
    return await this.lookbookService.getLookBookCollection(
      lookBookRequestCursorPaginationDto,
      req.user.id,
      userUUID,
    );
  }

  @CustomAuthDecorator(
    200,
    '룩북 상세 정보 불러오기 성공',
    '룩북 상세 정보 불러오는 작업: like와 save는 유저가 해당 룩북을 좋아요나 저장했는지를 나타내고, 댓글은 최신순 나열을 default로 반환.',
  )
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({ type: LookBookDetailResponseDataDto })
  @Get('/detail')
  async getLookBookDetail(
    @Query()
    lookBookRequestCursorPaginationDto: LookBookRequestCursorPaginationDto,
    @Req() req,
  ): Promise<LookBookDetailResponseDataDto> {
    return await this.lookbookService.getLookBookDetail(
      lookBookRequestCursorPaginationDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(
    200,
    '프로필에서 룩북 상세 정보 불러오기 성공',
    '프로필에서 룩북 상세 정보 불러오는 작업: !!keyword값이 있으면 안됨!!',
  )
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiResponse({ type: LookBookDetailResponseDataDto })
  @Get('/detail/profile/:userUUID')
  async getProfileLookBookDetail(
    @Query()
    lookBookRequestCursorPaginationDto: LookBookRequestCursorPaginationDto,
    @Req() req,
    @Param('userUUID') userUUID: string,
  ): Promise<LookBookDetailResponseDataDto> {
    return await this.lookbookService.getLookBookDetail(
      lookBookRequestCursorPaginationDto,
      req.user.id,
      userUUID,
    );
  }

  @CustomAuthDecorator(
    200,
    '내 프로필 마네킹-룩북 표지 불러오기 성공.',
    '내 프로필 마네킹-룩북 표지 불러오기 작업.',
  )
  @Get('/mannequin-lookbook')
  @ApiQuery({ name: 'cursor', required: false, type: Number })
  //Query param은 값을 주지 않으면 undefined가 됨.
  async getMannequinLookBookCollection(
    @Query()
    mannequinLookBookRequestCursorPaginationDto: MannequinLookBookRequestCursorPaginationDto,
    @Req() req,
  ): Promise<MannequinLookBookCollectionResponseData> {
    return await this.lookbookService.getMannequinLookBookCollection(
      mannequinLookBookRequestCursorPaginationDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(
    200,
    '내 프로필 마네킹-룩북 상세 불러오기 성공.',
    '내 프로필 마네킹-룩북 상세 불러오기 작업.',
  )
  @Get('/mannequin-lookbook/detail')
  async getMannequinLookBookDetail(
    @Query()
    mannequinLookBookRequestCursorPaginationDto: MannequinLookBookRequestCursorPaginationDto,
    @Req() req,
  ): Promise<MannequinLookBookDetailResponseData> {
    return await this.lookbookService.getMannequinLookBookDetail(
      mannequinLookBookRequestCursorPaginationDto,
      req.user.id,
    );
  }
}
