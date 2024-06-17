import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { LookBook } from './lookbooks.entity';
import { Accessory } from './clothes/accessories.entity';

@Entity()
export class AccessoryLookBook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Accessory, (accessory) => accessory.accessoryLookBooks)
  accessory: Accessory;

  @ManyToOne(() => LookBook, (lookbook) => lookbook.accessoryLookBooks, {
    onDelete: 'CASCADE',
  })
  lookbook: LookBook;
}
