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
import { UserPantSave } from './save-clothes/user-pant-save.entity';
import { Pant } from './clothes/pants.entity';
import { Shoe } from './clothes/shoes.entity';
import { TopLookBook } from './top-lookbook.entity';
import { AccessoryLookBook } from './accessory-lookbook.entity';
import { UserLookBookSave } from './save-clothes/user-lookbook-save.entity';
import { UserLookBookLike } from './user-lookbook-like.entity';
import { Comment } from './comments.entity';

@Entity()
export class LookBook extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('boolean', { default: true })
  show: boolean;

  @Column('varchar')
  title: string;

  @Column('varchar', { array: true })
  type: string[];

  @Column('text', { nullable: true })
  memo: string;

  @Column('int', { default: 0 })
  likeCnt: number;

  @Column('int', { default: 0 })
  commentCnt: number;

  @ManyToOne(() => User, (user) => user.lookbooks)
  user: User;
  @RelationId((lookbook: LookBook) => lookbook.user)
  userId: number;

  //하나의 바지가 여러 lookbook에 들어갈 수 있음.
  @ManyToOne(() => Pant, (pant) => pant.lookbooks)
  pant: Pant;

  @ManyToOne(() => Shoe, (shoe) => shoe.lookbooks)
  shoe: Shoe;

  @OneToMany(() => TopLookBook, (topLookBook) => topLookBook.lookbook)
  topLookBooks: TopLookBook[];

  @OneToMany(
    () => AccessoryLookBook,
    (accessoryLookBook) => accessoryLookBook.lookbook,
  )
  accessoryLookBooks: AccessoryLookBook[];

  @OneToMany(
    () => UserLookBookSave,
    (userLookBookSave) => userLookBookSave.lookbook,
  )
  userLookBookSaves: UserLookBookSave[];

  @OneToMany(
    () => UserLookBookLike,
    (userLookBookLike) => userLookBookLike.lookbook,
  )
  userLookBookLikes: UserLookBookLike[];

  @OneToMany(() => Comment, (comment) => comment.lookbook)
  comments: Comment[];
}
