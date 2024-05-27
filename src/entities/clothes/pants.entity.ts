import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { UserPantSave } from '../save-clothes/user-pant-save.entity';
import { LookBook } from '../lookbooks.entity';

@Entity()
export class Pant extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column('varchar')
  type: string;

  @Column('text', { nullable: true })
  memo: string;

  @ManyToOne(() => User, (user) => user.pants)
  user: User;

  @OneToMany(() => UserPantSave, (userPantSave) => userPantSave.pant)
  userPantSaves: UserPantSave[];

  @OneToMany(() => LookBook, (lookbook) => lookbook.pant)
  lookbooks: LookBook[];
}
