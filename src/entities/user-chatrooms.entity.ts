import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { User } from './users.entity';
import { ChatRoom } from './chatrooms.entity';
import { Chat } from './chats.entity';

@Entity()
export class UserChatRoom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userChatRooms)
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.userChatRooms)
  chatRoom: ChatRoom;

  @OneToMany(() => Chat, (chat) => chat.userChatRoom)
  chats: Chat[];
}
