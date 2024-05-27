import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { Pant } from '../clothes/pants.entity';

@Entity()
export class UserPantSave extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userPantSaves)
  user: User;

  @ManyToOne(() => Pant, (pant) => pant.userPantSaves)
  pant: Pant;
}
