import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRoom } from 'src/entities/chatrooms.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatRoomRepository extends Repository<ChatRoom> {
  constructor(dataSource: DataSource) {
    super(ChatRoom, dataSource.createEntityManager());
  }

  async createChatRoom(chatRoomTitle: string): Promise<ChatRoom> {
    const chatRoom = this.create({ title: chatRoomTitle });
    await this.save(chatRoom);
    return chatRoom;
  }
}
