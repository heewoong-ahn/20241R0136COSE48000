import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from 'typeorm';
import { At } from './at.entity';
import { User } from './users.entity';
import { LookBook } from './lookbooks.entity';

@Entity()
export class Comment extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => User, (user) => user.comments, { nullable: true })
  user: User;
  @RelationId((comment: Comment) => comment.user)
  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => LookBook, (lookbook) => lookbook.comments)
  lookbook: LookBook;

  //자기참조 : 대댓글
  @ManyToOne(() => Comment, { nullable: true })
  parentComment: Comment;
  //참고관계에 parentComment_Id라는 column을 만들어 부여해 join없이 부모 댓글 id 불러올 수 있음.
  @RelationId((comment: Comment) => comment.parentComment)
  @Column({ nullable: true })
  parentCommentId: number;
}
