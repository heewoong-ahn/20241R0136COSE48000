import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MannequinModule } from './mannequin/mannequin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      logging: true,
      autoLoadEntities: true, //entity loading
      synchronize: true, // 이 dir 을 root로 서버 DB를 수정해버려서 주의 필요!: schema 일치화
      namingStrategy: new SnakeNamingStrategy(),
    }),
    AuthModule,
    MannequinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
