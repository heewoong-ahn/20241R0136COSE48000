import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserChatRoom } from 'src/entities/user-chatrooms.entity';
import { ChatRoom } from 'src/entities/chatrooms.entity';
import { User } from 'src/entities/users.entity';

@Injectable()
export class UserChatRoomRepository extends Repository<UserChatRoom> {
  constructor(dataSource: DataSource) {
    super(UserChatRoom, dataSource.createEntityManager());
  }

  async findUserChatRoomByUserAndChatRoomId(
    userId: number,
    chatRoomId: number,
  ): Promise<UserChatRoom> {
    const userChatRoom = await this.findOne({
      where: { user: { id: userId }, chatRoom: { id: chatRoomId } },
    });
    return userChatRoom;
  }

  async findChatRoomByUserId(userId: number) {
    const userChatRoomCollection = await this.createQueryBuilder('userChatRoom')
      .leftJoinAndSelect('userChatRoom.user', 'user')
      .leftJoinAndSelect('userChatRoom.chatRoom', 'chatRoom')
      .where('user.id = :userId', { userId })
      .select(['userChatRoom.id', 'chatRoom.id', 'chatRoom.title'])
      .orderBy('chatRoom.createdAt', 'DESC')
      .getMany();

    return userChatRoomCollection;
  }

  async createUserChatRoom(
    chatRoomId: number,
    senderId: number,
    receipientId: number,
  ): Promise<UserChatRoom> {
    const chatRoom = new ChatRoom();
    chatRoom.id = chatRoomId;

    const sendUser = new User();
    sendUser.id = senderId;

    const receipientUser = new User();
    receipientUser.id = receipientId;

    const senderChatRoom = this.create({
      user: sendUser,
      chatRoom: chatRoom,
    });
    const receipientChatRoom = this.create({
      user: receipientUser,
      chatRoom: chatRoom,
    });
    await this.save(senderChatRoom);
    await this.save(receipientChatRoom);

    //채팅방을 만들고 난 직후는 보내는 사람의 userChatRoom을 return하여 사용자가 해당 userChatRoomId로 메시지를
    //보낼수 있게 함.
    return senderChatRoom;
  }
}
