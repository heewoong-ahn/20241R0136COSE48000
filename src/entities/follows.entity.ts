import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { User } from './users.entity';

@Entity()
export class Follow extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //팔로우 당하는 사람
  @ManyToOne(() => User, (user) => user.followers)
  followed_id: User;

  //팔로잉 하는 사람
  @ManyToOne(() => User, (user) => user.comments)
  follower_id: User;
}
