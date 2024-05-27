import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { Accessory } from '../clothes/accessories.entity';

@Entity()
export class UserAccessorySave extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userAccessorySaves)
  user: User;

  @ManyToOne(() => Accessory, (accessory) => accessory.userAccessorySaves)
  accessory: Accessory;
}
