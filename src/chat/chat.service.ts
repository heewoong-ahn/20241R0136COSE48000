import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatRepository } from 'src/repositories/chat.repository';
import { GetRoomChatCollectionRequestDto } from './dtos/get-room-chat-collection-request.dto';
import { UserChatRoomRepository } from 'src/repositories/user-chatroom.repository';
import { ChatRoomRepository } from 'src/repositories/chatroom.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { Chat } from 'src/entities/chats.entity';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly userChatRoomRepository: UserChatRoomRepository,
    private readonly chatRoomRepository: ChatRoomRepository,
    private readonly userRepository: UserRepository,
  ) {}

  //메시지 DB 저장.
  async createChat(userChatRoomId: number, content: string): Promise<Chat> {
    return await this.chatRepository.saveChat(userChatRoomId, content);
  }

  //메시지 방 생성 및 userChatRoom 2개 만들기.
  async createChatRoom(userId: number, receipientUserUUID: string) {
    const receipient =
      await this.userRepository.findUserByUUID(receipientUserUUID);
    if (!receipient) {
      throw new NotFoundException(
        '메시지를 보내려는 상대방이 존재하지 않습니다.',
      );
    }
    const sender = await this.userRepository.findUserById(userId);

    //채팅방 만들기.
    const chatRoomTitle = `${sender.nickname}-${receipient.nickname}`;
    const chatRoom =
      await this.chatRoomRepository.createChatRoom(chatRoomTitle);

    //채팅방에 연결된 유저 정보 바탕으로 해서 userChatRoom 생성 및 메세지 보낸 사람의 userChatRoom받아오기.
    const senderChatRoom = await this.userChatRoomRepository.createUserChatRoom(
      chatRoom.id,
      userId,
      receipient.id,
    );

    return { chatRoomId: chatRoom.id, senderChatRoomId: senderChatRoom.id };
  }

  //채팅방 목록 불러오기.
  //마지막 채팅내용과 함께 읽었는지 표시하기 위해 read값도 return 해주어야함.

  async getChatRoomCollection(userId: number) {
    const chatRoomCollection =
      await this.userChatRoomRepository.findChatRoomByUserId(userId);
    //chatRoomId로 채팅방 마지막 채팅 찾고
    //userChatRoomId로 채팅방에서의 마지막 대화가 내가 보낸 것인지 판별
    //불러온 userChatRoomId는 모두 내가 보낸 채팅의userChatRoomId이므로
    //마지막 채팅의 userChatRoomId가 내것과 같지 않다면 상대방이 보낸것.
    const chatRoomWithLastChatAndUnReadCnt = Promise.all(
      chatRoomCollection.map(async (item) => {
        const lastChat = await this.getLastChat(item.id, item.chatRoom.id);
        const unReadChatCnt = await this.countUnReadChat(
          item.id,
          item.chatRoom.id,
        );
        return { ...item, lastChat, unReadChatCnt };
      }),
    );
    return chatRoomWithLastChatAndUnReadCnt;
  }

  //채팅방별 마지막 대화 불러오기.

  async getLastChat(userChatRoomId: number, chatRoomId: number) {
    const lastChat = await this.chatRepository.getLastChat(chatRoomId);
    let lastChatByMe: boolean = true;
    if (lastChat.userChatRoom.id != userChatRoomId) {
      //마지막 대화가 내가 보낸게 아니면
      lastChatByMe = false;
    }
    const lastChatWithFlag = { ...lastChat, lastChatByMe };
    return lastChatWithFlag;
  }

  //채팅방별 안읽은 대화 갯수 세기.

  async countUnReadChat(
    userChatRoomId: number,
    chatRoomId: number,
  ): Promise<number> {
    const cnt = await this.chatRepository.countUnReadChat(
      userChatRoomId,
      chatRoomId,
    );
    return cnt;
  }

  //채팅 읽음 표시하기.

  async chatStateRead(chatRoomId: number, userId: number) {
    const userChatRoom =
      await this.userChatRoomRepository.findUserChatRoomByUserAndChatRoomId(
        userId,
        chatRoomId,
      );
    await this.chatRepository.chatStateRead(userChatRoom.id, chatRoomId);
    return;
  }

  //채팅 내용 불러오기.
  //시간 순서대로 옛날 순으로 불러오기.
  async getChatCollection(chatRoomId: number): Promise<Chat[]> {
    return await this.chatRepository.getChatCollection(chatRoomId);
  }
}
