import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { At } from './at.entity';
import { User } from './users.entity';
import { LookBook } from './lookbooks.entity';

@Entity()
export class UserLookBookLike extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userLookBookLikes)
  user: User;

  @ManyToOne(() => LookBook, (lookbook) => lookbook.userLookBookLikes)
  lookbook: LookBook;
}
