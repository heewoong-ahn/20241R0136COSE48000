import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  OneToOne,
} from 'typeorm';
import { User } from './users.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Mannequin extends BaseEntity {
  @Exclude()
  @PrimaryColumn()
  user_id: number;

  //단방향 매핑
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  //매핑할 fk와 매핑되는 column 지정 가능.
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('char', { length: 1, default: 'm' })
  sex: string;

  @Column('int', { default: 1 })
  hair: number;

  @Column('int', { default: 1 })
  skinColor: number;

  @Column('decimal', { default: 175.0, scale: 1 })
  height: number;

  @Column('numeric', { default: 65.0, scale: 1 })
  body: number;

  @Column('numeric', { default: 58.0, scale: 1 })
  arm: number;

  @Column('numeric', { default: 90.0, scale: 1 })
  leg: number;
}
