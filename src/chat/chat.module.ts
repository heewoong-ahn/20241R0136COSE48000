import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserChatRoom } from 'src/entities/user-chatrooms.entity';
import { Chat } from 'src/entities/chats.entity';
import { ChatRoom } from 'src/entities/chatrooms.entity';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from 'src/repositories/chat.repository';
import { UserChatRoomRepository } from 'src/repositories/user-chatroom.repository';
import { ChatRoomRepository } from 'src/repositories/chatroom.repository';
import { WebSocketJwtGuard } from './strategies/jwt-access-web-socket.strategy';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserChatRoom, Chat, ChatRoom])],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    ChatRepository,
    UserChatRoomRepository,
    ChatRoomRepository,
    UserRepository,
    WebSocketJwtGuard,
  ],
})
export class ChatModule {}
