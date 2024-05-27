import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { UserShoeSave } from '../save-clothes/user-shoe-save.entity';
import { LookBook } from '../lookbooks.entity';

@Entity()
export class Shoe extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column('varchar')
  type: string;

  @Column('text', { nullable: true })
  memo: string;

  @ManyToOne(() => User, (user) => user.shoes)
  user: User;

  @OneToMany(() => UserShoeSave, (userShoeSave) => userShoeSave.shoe)
  userShoeSaves: UserShoeSave[];

  @OneToMany(() => LookBook, (lookbook) => lookbook.shoe)
  lookbooks: LookBook[];
}
