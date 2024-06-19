import { Injectable, NotFoundException } from '@nestjs/common';
import { GetRoomChatCollectionRequestDto } from 'src/chat/dtos/get-room-chat-collection-request.dto';
import { SendChatRequestDto } from 'src/chat/dtos/send-chat-request.dto';
import { Chat } from 'src/entities/chats.entity';
import { User } from 'src/entities/users.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  async saveChat(userChatRoomId: number, content: string): Promise<Chat> {
    const chat = this.create({
      userChatRoom: { id: userChatRoomId },
      content: content,
    });
    return await this.save(chat);
  }

  async getLastChat(chatRoomId: number): Promise<Chat> {
    return this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.userChatRoom', 'userChatRoom')
      .leftJoinAndSelect('userChatRoom.chatRoom', 'chatRoom')
      .select(['chat.content', 'chat.createdAt', 'userChatRoom.id']) //마지막 채팅의 createdAt으로 전체 채팅방 순서 정함
      .where('chatRoom.id = :chatRoomId', { chatRoomId })
      .orderBy('chat.createdAt', 'DESC')
      .getOne();
  }

  async chatStateRead(userChatRoomId: number, chatRoomId: number) {
    const chatCollection = await this.getChatCollection(chatRoomId);
    chatCollection.map(async (chat) => {
      //채팅방 들어갔을 때 채팅중 내가 보낸 채팅이 아니면 읽음으로 바꿔줌.
      if (chat.userChatRoom.id != userChatRoomId) {
        chat.read = true;
        await this.save(chat);
      }
    });
  }

  async countUnReadChat(
    userChatRoomId: number,
    chatRoomId: number,
  ): Promise<number> {
    const cnt = this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.userChatRoom', 'userChatRoom')
      .leftJoinAndSelect('userChatRoom.chatRoom', 'chatRoom')
      .where('chatRoom.id = :chatRoomId', { chatRoomId }) //채팅방 모든 채팅 찾기
      .andWhere('userChatRoom.id != :userChatRoomId', { userChatRoomId }) //내가 보내지 않은 채팅 찾기
      .andWhere('chat.read = :readOrNot', { readOrNot: false }) //안읽은 채팅 찾기
      .getCount();

    return cnt;
  }

  //옛날 채팅 목록부터 가져옴.
  async getChatCollection(chatRoomId: number): Promise<Chat[]> {
    const chatCollection = this.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.userChatRoom', 'userChatRoom')
      .leftJoinAndSelect('userChatRoom.chatRoom', 'chatRoom')
      .leftJoinAndSelect('userChatRoom.user', 'user')
      .select(['chat.content', 'chat.read', 'userChatRoom', 'user.nickname'])
      .where('chatRoom.id = :chatRoomId', { chatRoomId })
      .orderBy('chat.createdAt', 'ASC')
      .getMany();

    return chatCollection;
  }

  //   async getUsersInChatRoom(chatRoomId: number) {
  //     const usersInChatRoom = await this.find({
  //       where: {
  //         userChatRoom: {
  //           chatRoom: { id: chatRoomId },
  //         },
  //       },
  //       relations: ['userChatRoom'],
  //       select: {
  //         userChatRoom: { user: { id: true } },
  //       },
  //     });

  //     const users = usersInChatRoom.map((item) => item.userChatRoom.user.id);
  //     return users;
  //   }
}
