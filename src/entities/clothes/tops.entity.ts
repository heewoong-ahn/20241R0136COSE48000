import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { UserTopSave } from '../save-clothes/user-top-save.entity';
import { TopLookBook } from '../top-lookbook.entity';

@Entity()
export class Top extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column('varchar')
  type: string;

  @Column('text', { nullable: true })
  memo: string;

  @ManyToOne(() => User, (user) => user.tops)
  user: User;

  @OneToMany(() => UserTopSave, (userTopSave) => userTopSave.top)
  userTopSaves: UserTopSave[];

  @OneToMany(() => TopLookBook, (topLookBook) => topLookBook.top)
  topLookBooks: TopLookBook[];
}
