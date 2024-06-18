import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { UseGuards } from '@nestjs/common';
import { WebSocketJwtGuard } from './strategies/jwt-access-web-socket.strategy';
import { AuthenticatedSocket } from 'src/commons/interfaces/authenticated-socket.interface';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @UseGuards(WebSocketJwtGuard)
  async handleConnection(client: AuthenticatedSocket) {
    const userId = client.user.id;
    client['userId'] = userId;
    console.log(`Client connected: ${userId}`);
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userId = client['userId'];
    console.log(`Client disconnected: ${userId}`);
  }

  @SubscribeMessage('joinRoom')
  @UseGuards(WebSocketJwtGuard)
  async handleJoinRoom(
    client: AuthenticatedSocket,
    payload: { chatRoomId: number },
  ) {
    const userId = client['userId'];
    const { chatRoomId } = payload;
    //방에 들어가면 상대방 모든 채팅 읽음처리로 바꿈.
    await this.chatService.chatStateRead(chatRoomId, userId);
    client.join(`room-${chatRoomId}`);
    console.log(`User ${userId} joined room ${chatRoomId}`);
  }

  @SubscribeMessage('leaveRoom')
  @UseGuards(WebSocketJwtGuard)
  handleLeaveRoom(
    client: AuthenticatedSocket,
    payload: { chatRoomId: number },
  ) {
    const userId = client['userId'];
    const { chatRoomId } = payload;
    client.leave(`room-${chatRoomId}`);
    console.log(`User ${userId} left room ${chatRoomId}`);
  }

  @SubscribeMessage('chat')
  async handleMessage(
    client: AuthenticatedSocket,
    payload: { chatRoomId: number; userChatRoomId: number; content: string },
  ) {
    const { chatRoomId, userChatRoomId, content } = payload;

    const chat = await this.chatService.createChat(userChatRoomId, content);
    this.server.to(`room-${chatRoomId}`).emit('chat', chat);
  }

  @SubscribeMessage('createRoomAndSendMessage')
  @UseGuards(WebSocketJwtGuard)
  async handleCreateRoomAndSendMessage(
    client: AuthenticatedSocket,
    payload: { content: string; receipientUserUUID: string },
  ) {
    const userId = client['userId'];
    const { content, receipientUserUUID } = payload;

    // 새로운 방, userChatRoom2개를 생성하고 메시지를 데이터베이스에 저장
    const { chatRoomId, senderChatRoomId } =
      await this.chatService.createChatRoom(userId, receipientUserUUID);

    const chat = await this.chatService.createChat(senderChatRoomId, content);

    // 클라이언트를 새로운 방에 참여시킴
    client.join(`room-${chatRoomId}`);
    console.log(`User ${userId} created and joined room ${chatRoomId}`);

    // 클라이언트에게 방이 생성되었음을 알리고 생성된 charRoomId를 전달해 추후 해당
    //chatRoomId (gateway에서 유저 2명을 같은 방에 join하기 위함.)와
    //userChatRoomId (챗 할때마다 DB에 저장하는 로직 간편화하기 위함)로 chat을 날리도록 함.
    client.emit('roomCreated', chatRoomId);
    client.emit('sendRoomCreated', senderChatRoomId);

    // 메시지를 해당 방에 있는 클라이언트에게만 전송
    this.server.to(`room-${chatRoomId}`).emit('chat', chat);
  }
}
