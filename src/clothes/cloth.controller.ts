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
  ParseEnumPipe,
} from '@nestjs/common';
import { ClothService } from './cloth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UploadClothDto } from './dtos/upload-cloth.dto';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import { ClothCategory } from 'src/commons/enums/cloth-category.enum';
import {
  ResponseClothCollectionDto,
  ResponseClothDto,
} from './dtos/response-cloth.dto';

@Controller('clothes')
@ApiTags('옷 작업 api')
export class ClothController {
  constructor(private readonly clothService: ClothService) {}

  @CustomAuthDecorator(200, '파일 업로드 성공', '옷 사진 파일 업로드 작업')
  @Post('/upload/:category')
  @ApiConsumes('multipart/form-data')
  //스웨거에 enum 타입의 param 표시를 위한 작업.
  @ApiParam({
    name: 'category',
    enum: ClothCategory,
    description: '해당 의류 카테고리 명시',
  })
  //file은 UploadedFile()로 받아야지만 값이 제대로 담긴다.
  @UseInterceptors(FileInterceptor('file'))
  async uploadTop(
    //enum형태의 validation은 따로 ParseEnumPipe를 통해야함.
    @Param('category', new ParseEnumPipe(ClothCategory))
    category: ClothCategory,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadClothDto: UploadClothDto,
    @Req() req,
  ) {
    return await this.clothService.uploadCloth(
      category,
      file,
      uploadClothDto,
      req.user.id,
    );
  }

  @CustomAuthDecorator(
    200,
    '해당 카테고리 옷 전체 불러오기 성공',
    '해당 카테고리의 사용자 모든 옷 불러오기',
  )
  @ApiResponse({ type: ResponseClothCollectionDto, isArray: true })
  @ApiParam({
    name: 'category',
    enum: ClothCategory,
    description: '해당 의류 카테고리 명시',
  })
  @Get('/:category')
  async getClothCollection(
    @Param('category', new ParseEnumPipe(ClothCategory))
    category: ClothCategory,
    @Req() req,
  ) {
    return await this.clothService.getClothCollection(category, req.user.id);
  }

  @CustomAuthDecorator(204, '파일 삭제 성공', '옷 파일 삭제 작업')
  @ApiParam({
    name: 'category',
    enum: ClothCategory,
    description: '해당 의류 카테고리 명시',
  })
  @HttpCode(204)
  @Delete('/:category/:id')
  async deleteCloth(
    @Param('category', new ParseEnumPipe(ClothCategory))
    category: ClothCategory,
    @Param('id') id: number,
    @Req() req,
  ) {
    await this.clothService.deleteCloth(category, id, req.user.id);
  }

  @CustomAuthDecorator(
    200,
    '해당 의류 상세정보 불러오기 성공',
    '선택된 의류의 상세 정보 불러오기',
  )
  @ApiParam({
    name: 'category',
    enum: ClothCategory,
    description: '해당 의류 카테고리 명시',
  })
  @ApiResponse({ type: ResponseClothDto })
  @Get('/:category/:id')
  async getClothDetail(
    @Param('category', new ParseEnumPipe(ClothCategory))
    category: ClothCategory,
    @Param('id') id: number,
    @Req() req,
  ) {
    return await this.clothService.getClothDetail(category, id, req.user.id);
  }

  @CustomAuthDecorator(
    200,
    '해당 카테고리 찜한 옷 전체 불러오기 성공',
    '해당 카테고리의 찜한 모든 옷 불러오기 작업',
  )
  @ApiResponse({ type: ResponseClothCollectionDto, isArray: true })
  @ApiParam({
    name: 'category',
    enum: ClothCategory,
    description: '해당 의류 카테고리 명시',
  })
  @Get('/clips/all/:category')
  async getClippedClothCollection(
    @Param('category', new ParseEnumPipe(ClothCategory))
    category: ClothCategory,
    @Req() req,
  ) {
    console.log(`Received category: ${category}`);
    return await this.clothService.getClippedClothCollection(
      category,
      req.user.id,
    );
  }

  //post기능과 delete을 한 곳에 둔게 restful하지 않음. front에서 찜 여부 체크해서 다른 endpoint호출하게 해야하나?
  @CustomAuthDecorator(201, '옷 찜/찜 해제 성공', '옷 찜/찜 해제 작업')
  @ApiParam({
    name: 'category',
    enum: ClothCategory,
    description: '해당 의류 카테고리 명시',
  })
  @Post('/clips/:category/:id')
  async clipCloth(
    @Param('category', new ParseEnumPipe(ClothCategory))
    category: ClothCategory,
    @Param('id') id: number,
    @Req() req,
  ) {
    return await this.clothService.clipCloth(category, id, req.user.id);
  }
}
