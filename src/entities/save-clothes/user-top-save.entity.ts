import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { Top } from '../clothes/tops.entity';

@Entity()
export class UserTopSave extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userTopSaves)
  user: User;

  @ManyToOne(() => Top, (top) => top.userTopSaves)
  top: Top;
}
