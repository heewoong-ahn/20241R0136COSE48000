import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { User } from 'src/entities/users.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { Comment } from 'src/entities/comments.entity';
import { CommentRepository } from 'src/repositories/comment.repository';
import { LookBookRepository } from 'src/repositories/lookbooks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, LookBook])],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, LookBookRepository],
  exports: [CommentService],
})
export class CommentModule {}
