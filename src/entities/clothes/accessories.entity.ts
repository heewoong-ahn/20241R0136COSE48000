import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { At } from '../at.entity';
import { User } from '../users.entity';
import { UserAccessorySave } from '../save-clothes/user-accessory-save.entity';
import { AccessoryLookBook } from '../accessory-lookbook.entity';

@Entity()
export class Accessory extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @Column('varchar')
  type: string;

  @Column('text', { nullable: true })
  memo: string;

  @ManyToOne(() => User, (user) => user.accessories)
  user: User;

  @OneToMany(
    () => UserAccessorySave,
    (userAccessorySave) => userAccessorySave.accessory,
  )
  userAccessorySaves: UserAccessorySave[];

  @OneToMany(
    () => AccessoryLookBook,
    (accessoryLookBook) => accessoryLookBook.accessory,
  )
  accessoryLookBooks: AccessoryLookBook[];
}
