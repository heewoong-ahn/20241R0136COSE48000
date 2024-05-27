import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { Shoe } from '../clothes/shoes.entity';

@Entity()
export class UserShoeSave extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userShoeSaves)
  user: User;

  @ManyToOne(() => Shoe, (shoe) => shoe.userShoeSaves)
  shoe: Shoe;
}
