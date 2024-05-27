import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { At } from './at.entity';
import { UserChatRoom } from './user-chatrooms.entity';

@Entity()
export class ChatRoom extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  title: string;

  @OneToMany(() => UserChatRoom, (userChatRoom) => userChatRoom.chatRoom)
  userChatRooms: UserChatRoom[];
}
