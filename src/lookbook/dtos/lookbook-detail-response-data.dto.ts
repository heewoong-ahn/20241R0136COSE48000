import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import {
  ClothData,
  CommentData,
  LookBookData,
  LookBookDetailDataTransform,
  UserData,
} from 'src/commons/interfaces/lookbook-detail-data-response.interface';
import { TopLookBook } from 'src/entities/top-lookbook.entity';
import { LookBookResponseCursorPaginationMetaDto } from './lookbook-response-curson-pagination-meta.dto';

class LookBookDataClass implements LookBookData {
  @ApiProperty({ example: 1, description: '룩북 ID' })
  lookbookId: number;

  @ApiProperty({ example: '룩북 제옥', description: '제목' })
  title: string;

  @ApiProperty({ example: ['스트릿', '캐쥬얼'], description: '룩북 type' })
  type: string[];

  @ApiProperty({
    example: '룩북 내용',
    description: '사용자가 룩북 저장할 때 입력한 값',
    required: false,
    nullable: true,
  })
  memo?: string | null;

  @ApiProperty({ example: 100, description: '좋아요 수' })
  likeCnt: number;

  @ApiProperty({ example: 20, description: '댓글 수' })
  commentCnt: number;
}

class UserDataClass implements UserData {
  @ApiProperty({
    example:
      'e4d3a0d5-b068-4486-ba9b-34fe6536025d //uuid통해서 룩북 작성자의 프로필 들어갈 수 있음.',
    description: 'uuid',
  })
  uuid: string;

  @ApiProperty({ example: '주영', description: '닉네임' })
  nickname: string;

  @ApiProperty({ example: true, description: '좋아요 여부' })
  like: boolean;

  @ApiProperty({ example: false, description: '저장 여부' })
  save: boolean;
}

class ClothDataClass implements ClothData {
  @ApiProperty({ example: 1, description: '옷 ID' })
  id: number;

  @ApiProperty({
    example: '~~~~/~~~~~.jpg',
    description: '이미지 URL',
  })
  url: string;

  @ApiProperty({
    example: '옷 메모',
    description: '옷 저장할 때 장석한 메모',
    required: false,
    nullable: true,
  })
  memo?: string | null;
}

class CommentDataClass implements CommentData {
  @ApiProperty({ example: 1, description: '댓글 ID' })
  id: number;

  @ApiProperty({
    example: null,
    description: '부모 댓글 ID',
    required: false,
    nullable: true,
  })
  parentId: number | null;

  @ApiProperty({ example: '댓글 내용', description: '댓글 내용' })
  content: string;

  @ApiProperty({
    example: '희웅 //삭제된 게시글이면 null로 표시됨.',
    description: '작성자 이름',
    required: false,
    nullable: true,
  })
  writer?: string | null;

  @ApiProperty({
    example:
      'e4d3a0d5-b068-4486-ba9b-34fe6536025d //uuid통해서 해당 작성자의 프로필 들어갈 수 있음.',
    description: '작성자의 UUID',
    required: false,
    nullable: true,
  })
  writerUUID?: string | null;
}

class LookBookDetailDataTransformClass implements LookBookDetailDataTransform {
  @ApiProperty({ type: LookBookDataClass })
  lookbook: LookBookData;

  @ApiProperty({ type: UserDataClass })
  user: UserData;

  @ApiProperty({ type: [ClothDataClass] })
  tops: ClothData[];

  @ApiProperty({ type: [ClothDataClass] })
  accessories: ClothData[];

  @ApiProperty({ type: ClothDataClass })
  pant: ClothData;

  @ApiProperty({ type: ClothDataClass })
  shoe: ClothData;

  @ApiProperty({ type: [CommentDataClass] })
  comments: CommentData[];

  constructor(item: any) {
    this.lookbook = {
      lookbookId: item.id,
      title: item.title,
      type: item.type,
      memo: item.memo,
      likeCnt: item.likeCnt,
      commentCnt: item.commentCnt,
    };
    this.user = {
      uuid: item.user.uuid,
      nickname: item.user.nickname,
      like: item.like,
      save: item.save,
    };
    this.tops = item.topLookBooks.map((topLookBook) => ({
      id: topLookBook.top.id,
      url: topLookBook.top.url,
      memo: topLookBook.top.memo,
    }));
    this.accessories = item.accessoryLookBooks.map((accessoryLookBook) => ({
      id: accessoryLookBook.accessory.id,
      url: accessoryLookBook.accessory.url,
      memo: accessoryLookBook.accessory.memo,
    }));
    this.pant = {
      id: item.pant.id,
      url: item.pant.url,
      memo: item.pant.memo,
    };
    this.shoe = {
      id: item.shoe.id,
      url: item.shoe.url,
      memo: item.shoe.memo,
    };
    this.comments = item.comments.map((comment) => ({
      id: comment.id,
      parentId: comment.parentCommentId,
      content: comment.content,
      writer: comment.user.nickname,
      writerUUID: comment.user.uuid,
    }));
  }
}

export class LookBookDetailResponseDataDto {
  @ApiProperty({ type: [LookBookDetailDataTransformClass] })
  @IsArray()
  readonly lookBookDetail: LookBookDetailDataTransform[];

  @ApiProperty({ type: LookBookResponseCursorPaginationMetaDto })
  readonly cursorPaginationMetaData: LookBookResponseCursorPaginationMetaDto;

  constructor(data: any[], meta: LookBookResponseCursorPaginationMetaDto) {
    this.lookBookDetail = data.map(
      (item) => new LookBookDetailDataTransformClass(item),
    );
    this.cursorPaginationMetaData = meta;
  }
}
