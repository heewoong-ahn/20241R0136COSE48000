import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { AuthenticatedSocket } from 'src/commons/interfaces/authenticated-socket.interface';

@Injectable()
export class WebSocketJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: AuthenticatedSocket = context.switchToWs().getClient();
    const token = client.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('사용자 인증 정보가 존재하지 않습니다.');
      return false;
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS);
      client.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
      return false;
    }
  }
}
