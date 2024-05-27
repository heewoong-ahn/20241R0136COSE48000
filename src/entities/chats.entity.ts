import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { At } from './at.entity';
import { UserChatRoom } from './user-chatrooms.entity';

@Entity()
export class Chat extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @ManyToOne(() => UserChatRoom, (userChatRoom) => userChatRoom.chats)
  userChatRoom: UserChatRoom;
}
