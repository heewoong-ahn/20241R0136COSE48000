import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentService } from './comment.service';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';

@Controller('comment')
@ApiTags('댓글 작업 api')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @CustomAuthDecorator(201, '댓글 달기 성공', '댓글 달기 작업')
  @ApiOperation({
    description:
      '대댓글이 아닌 경우 parentCommentId는 JSON객체에 담아 보내지 않는다.',
  })
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    return this.commentService.createComment(createCommentDto, req.user.id);
  }

  @CustomAuthDecorator(204, '댓글 지우기 성공', '댓글 지우기 작업')
  @HttpCode(204)
  @Delete('/:commentId')
  async deleteComment(@Param('commentId') commentId: number, @Req() req) {
    return this.commentService.deleteComment(commentId, req.user.id);
  }
}
