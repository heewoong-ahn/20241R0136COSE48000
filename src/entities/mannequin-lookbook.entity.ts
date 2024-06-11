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

@Entity()
export class MannequinLookBook extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column('varchar')
  title: string;

  @Column('varchar', { array: true })
  type: string[];

  @Column('text', { nullable: true })
  memo: string;

  @ManyToOne(() => User, (user) => user.mannequinLookBooks)
  user: User;
  @RelationId((mannequinLookBook: MannequinLookBook) => mannequinLookBook.user)
  userId: number;
}
