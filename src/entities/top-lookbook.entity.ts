import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { LookBook } from './lookbooks.entity';
import { Top } from './clothes/tops.entity';

@Entity()
export class TopLookBook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Top, (top) => top.topLookBooks)
  top: Top;

  @ManyToOne(() => LookBook, (lookbook) => lookbook.topLookBooks)
  lookbook: LookBook;
}
