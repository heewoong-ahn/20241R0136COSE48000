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
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({ example: 'm', description: '성별' })
  sex: string;

  @Column('int', { default: 1 })
  @ApiProperty({ example: 1, description: '머리 스타일' })
  hair: number;

  @Column('int', { default: 1 })
  @ApiProperty({ example: 1, description: '피부 색상' })
  skinColor: number;

  @Column('decimal', { default: 175.0, scale: 1 })
  @ApiProperty({ example: 175.0, description: '키' })
  height: number;

  @Column('numeric', { default: 65.0, scale: 1 })
  @ApiProperty({ example: 65.0, description: '몸무게' })
  body: number;

  @Column('numeric', { default: 58.0, scale: 1 })
  @ApiProperty({ example: 58.0, description: '팔 길이' })
  arm: number;

  @Column('numeric', { default: 90.0, scale: 1 })
  @ApiProperty({ example: 90.0, description: '다리 길이' })
  leg: number;
}
