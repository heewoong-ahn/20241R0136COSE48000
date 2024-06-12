import {
  ForbiddenException,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentRepository } from 'src/repositories/comment.repository';
import { LookBookRepository } from 'src/repositories/lookbooks.repository';
import { Comment } from 'src/entities/comments.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly lookBookRepository: LookBookRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    //댓글을 달려는 lookbook이 존재하지 않을경우.
    const lookbook = await this.lookBookRepository.findLookBookById(
      createCommentDto.lookbookId,
    );
    console.log(lookbook);
    if (!lookbook) {
      throw new NotFoundException('댓글을 달려는 룩북이 존재하지 않습니다.');
    }
    //대댓글을 달려는 댓글이 존재하지 않을경우.
    if (createCommentDto.parentCommentId) {
      const parentComment = await this.commentRepository.findCommentById(
        createCommentDto.parentCommentId,
      );
      if (!parentComment) {
        throw new NotFoundException(
          '대댓글을 달 부모 댓글이 존재하지 않습니다.',
        );
      }
    }
    return this.commentRepository.createComment(createCommentDto, userId);
  }

  async deleteComment(commentId: number, userId: number) {
    const comment = await this.commentRepository.findCommentById(commentId);
    //삭제하려는 댓글이 존재하지 않을 경우.
    if (!comment) {
      throw new NotFoundException(
        '해당 댓글이 존재하지 않아 삭제할 수 없습니다.',
      );
    }
    //자기가 작성하지 않은 댓글을 삭제하려 할 경우를 막음.
    if (comment.userId != userId) {
      throw new ForbiddenException('해당 댓글을 삭제할 권한이 없습니다.');
    }
    return this.commentRepository.deleteComment(commentId);
  }

  async hardDeleteAllLookBookRelatedComment(lookbookId: number) {
    const commentCollection =
      await this.commentRepository.findCommentCollectionByLookBookId(
        lookbookId,
      );

    commentCollection.map((comment) =>
      this.commentRepository.hardDeleteComment(comment),
    );

    return;
  }

  async getCommentCollection(lookbookId: number): Promise<Comment[]> {
    return await this.commentRepository.getCommentCollection(lookbookId);
  }
}
