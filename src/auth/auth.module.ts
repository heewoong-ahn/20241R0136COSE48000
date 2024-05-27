import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from 'src/entities/users.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { UserRepository } from 'src/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAccessStrategy } from './strategies/jwt-access';
import { JwtRefreshStrategy } from './strategies/jwt-refresh';
import { JwtModule } from '@nestjs/jwt';
import { Mannequin } from 'src/entities/mannequins.entity';
import { Top } from 'src/entities/clothes/tops.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { UserAccessorySave } from 'src/entities/save-clothes/user-accessory-save.entity';
import { UserPantSave } from 'src/entities/save-clothes/user-pant-save.entity';
import { UserShoeSave } from 'src/entities/save-clothes/user-shoe-save.entity';
import { UserTopSave } from 'src/entities/save-clothes/user-top-save.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { AccessoryLookBook } from 'src/entities/accessory-lookbook.entity';
import { TopLookBook } from 'src/entities/top-lookbook.entity';
import { UserLookBookSave } from 'src/entities/save-clothes/user-lookbook-save.entity';
import { UserLookBookLike } from 'src/entities/user-lookbook-like.entity';
import { Comment } from 'src/entities/comments.entity';
import { Follow } from 'src/entities/follows.entity';
import { UserChatRoom } from 'src/entities/user-chatrooms.entity';
import { Chat } from 'src/entities/chats.entity';
import { ChatRoom } from 'src/entities/chatrooms.entity';

@Global()
@Module({
  imports: [
    // MailerModule.forRootAsync({
    //   useFactory: () => ({
    //     transport: {
    //       host: 'smtp.naver.com',
    //       port: 587,
    //       auth: {
    //         user: process.env.EMAILADDRESS,
    //         pass: process.env.EMAILPASSWORD,
    //       },
    //     },
    //     defaults: {
    //       from: `'LookAtME' <${process.env.EMAILADDRESS}>`, //보낸사람
    //     },
    //   }),
    // }),
    TypeOrmModule.forFeature([
      User,
      Mannequin,
      Top,
      Shoe,
      Accessory,
      Pant,
      UserAccessorySave,
      UserPantSave,
      UserShoeSave,
      UserTopSave,
      LookBook,
      AccessoryLookBook,
      TopLookBook,
      UserLookBookSave,
      UserLookBookLike,
      Comment,
      Follow,
      UserChatRoom,
      Chat,
      ChatRoom,
    ]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthModule {}
