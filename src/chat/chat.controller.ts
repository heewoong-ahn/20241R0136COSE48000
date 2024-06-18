import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomAuthDecorator } from 'src/commons/decorators/auth-swagger.decorator';
import { GetRoomChatCollectionRequestDto } from './dtos/get-room-chat-collection-request.dto';

@Controller('chat')
@ApiTags('채팅 작업 api')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @CustomAuthDecorator(
    200,
    '메세지 불러오기 성공',
    '채팅방 메세지 불러오기 작업',
  )
  @Get('/:chatRoomId')
  async getChatCollection(
    @Param() getRoomChatCollectionRequestDto: GetRoomChatCollectionRequestDto,
  ) {
    return await this.chatService.getChatCollection(
      getRoomChatCollectionRequestDto.chatRoomId,
    );
  }

  @CustomAuthDecorator(
    200,
    '채팅방 목록 불러오기 성공',
    '채팅방 목록 불러오기 작업',
  )
  @Get('/me/chatrooms')
  async getChatRoomCollection(@Req() req) {
    return await this.chatService.getChatRoomCollection(req.user.id);
  }
}
