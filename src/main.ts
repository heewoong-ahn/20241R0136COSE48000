import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // whitelist: true, // DTO에 작성한 값만 수신
      // forbidNonWhitelisted: true, // DTO에 작성된 필수값이 수신되지 않을 경우 에러
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('LookAtME API')
    .setDescription('LookAtME API Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Access Token',
        description: 'Enter JWT Access Token',
        in: 'header',
      },
      'Access Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        name: 'Refresh Token',
        description: 'Enter JWT Refresh Token',
        in: 'header',
      },
      'Refresh Token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //hot reloading을 통해서 --watch를 통한 변경사항 접수 및 재시작을 하지 않고
  //변경사항 감지 시 서버를 재시작 할 필요 없이 변경사항을 적용시킨다.
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(3000);
}
bootstrap();
