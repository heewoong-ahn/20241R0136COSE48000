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
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  exports: [JwtAccessStrategy],
})
export class AuthModule {}
