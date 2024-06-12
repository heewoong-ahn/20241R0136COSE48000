import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from 'src/comment/dtos/create-comment.dto';
import { Comment } from 'src/entities/comments.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CommentRepository extends Repository<Comment> {
  constructor(dataSource: DataSource) {
    super(Comment, dataSource.createEntityManager());
  }

  async findCommentById(commentId: number): Promise<Comment> {
    const comment = await this.findOne({ where: { id: commentId } });
    return comment;
  }

  async findCommentCollectionByLookBookId(
    lookbookId: number,
  ): Promise<Comment[]> {
    // const commentCollection = await this.find({
    //   where: { lookbook: { id: lookbookId } },
    //   withDeleted: true,
    // });
    // return commentCollection;
    const commentCollection = await this.createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select([
        'user.nickname',
        'comment.id',
        'comment.content',
        'comment.parentCommentId',
      ])
      .where('comment.lookbook.id = :lookbookId', { lookbookId })
      .withDeleted()
      .getMany();

    return commentCollection;
  }

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const { lookbookId, content, parentCommentId } = createCommentDto;
    const user = new User();
    user.id = userId;

    const lookbook = new LookBook();
    lookbook.id = lookbookId;

    //부모댓글이 존재해서 대댓글인 경우.
    if (createCommentDto.parentCommentId) {
      const parentComment = new Comment();
      parentComment.id = parentCommentId;

      const comment = this.create({ content, user, lookbook, parentComment });
      this.save(comment);
      return;
    }

    //대댓글이 아닌 경우.
    const comment = this.create({ content, user, lookbook });
    this.save(comment);
    return;
  }

  async deleteComment(commentId: number) {
    const commentToDelete = await this.findCommentById(commentId);

    //삭제된 댓글 표시 문구.
    commentToDelete.content = '삭제된 댓글입니다.';
    await this.save(commentToDelete);
    await this.softRemove(commentToDelete);

    return;
  }

  async hardDeleteComment(comment: Comment) {
    await this.remove(comment);
    return;
  }

  async getCommentCollection(lookbookId: number): Promise<Comment[]> {
    const commentCollection =
      await this.findCommentCollectionByLookBookId(lookbookId);

    const filterDeletedCommentCollection = commentCollection.map((comment) => {
      //삭제된 댓글이면
      if (comment.deletedAt != null) {
        comment.user = null;
      }
      return comment;
    });
    return filterDeletedCommentCollection;
  }
}
