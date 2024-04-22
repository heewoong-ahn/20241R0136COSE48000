import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { v4 as uuidv4 } from 'uuid';
// import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserDto } from './dtos/create-user-dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { LoginDto } from './dtos/login-dto';
import { JwtService } from '@nestjs/jwt';
import { checkDuplicateLoginId } from './dtos/check-duplicate-loginId-dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    // private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly uuidExpire: Map<string, { expiresAt: Date }> = new Map();

  //   //이메일 인증 6자리 코드 생성.
  //   async createEmailCode() {
  //     const uuid = uuidv4().substring(0, 6);
  //     const expiresAt = new Date();
  //     expiresAt.setMinutes(expiresAt.getMinutes() + 5);
  //     this.uuidExpire.set(uuid, { expiresAt });
  //     return uuid;
  //   }

  //   //이메일 발송.
  //   async sendEmailAuth(email: string): Promise<string> {
  //     const code = await this.createEmailCode();
  //     await this.mailerService.sendMail({
  //       to: email,
  //       subject: 'LookAtME 회원가입 이메일 인증번호입니다.',
  //       text: `인증번호: ${code}\n가입해 주셔서 감사합니다.`,
  //     });
  //     return code;
  //   }

  //loginId 중복 체크
  async checkDuplicateLoginId(checkDuplicateLoginId: checkDuplicateLoginId) {
    const user = await this.userRepository.findUserByLoginId(
      checkDuplicateLoginId.loginId,
    );
    if (user) {
      throw new ConflictException('해당 아이디는 이미 존재합니다.');
    }

    return { message: `${checkDuplicateLoginId.loginId}로 로그인 가능합니다.` };
  }

  //회원가입
  async createUser(createUserDto: CreateUserDto) {
    const userById = await this.userRepository.findUserByLoginId(
      createUserDto.loginId,
    );
    if (userById) {
      throw new ConflictException('해당 아이디는 이미 존재합니다.');
    }

    const userByPhoneNumber = await this.userRepository.findUserByPhoneNumber(
      createUserDto.phoneNumber,
    );
    if (userByPhoneNumber) {
      throw new ConflictException(
        '해당 전화번호로 만들어진 아이디가 이미 존재합니다.',
      );
    }

    //비밀번호 암호화
    const salt = await bcrypt.genSalt(10); //복잡도 10의 salt를 생성
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    createUserDto.password = hashedPassword;

    const newUser = await this.userRepository.createUser(createUserDto);

    return { message: `${newUser.loginId} 유저가 생성되었습니다.` };
  }

  // 비밀번호 맞는지 확인
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  //로그인
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findUserByLoginId(loginDto.loginId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 아이디입니다.');
    }
    const isPasswordMatch = await this.comparePassword(
      loginDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('비밀번호가 맞지 않습니다.');
    }

    const jwtAccess = this.getAccessToken(user);
    const jwtRefresh = this.getRefreshToken(user);

    const salt = await bcrypt.genSalt(10); //복잡도 10의 salt를 생성
    const hashedJwtRefresh = await bcrypt.hash(jwtRefresh, salt);

    //암호화된 jwt refresh token을 DB에 저장함으로서 DB 탈취에 대비
    await this.userRepository.saveJwtRefresh(loginDto, hashedJwtRefresh);

    return {
      message: '로그인 성공',
      AccessToken: jwtAccess,
      RefreshToken: jwtRefresh,
    };
  }

  // RefreshToken이 DB에 저장되어 있는 것과 일치하는지 확인.
  async compareRefreshToken(
    refreshToken: string,
    hashedRefreshToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(refreshToken, hashedRefreshToken);
  }

  //AccessToken 재발급
  async newAccessToken(id: number, refreshToken: string) {
    const user = await this.userRepository.findUserById(id);
    const isRefreshTokenMatch = await this.compareRefreshToken(
      refreshToken,
      user.jwtRefresh,
    );

    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException('Refresh Token이 일치하지 않습니다.');
    }
    const newJwtAccess = this.getAccessToken(user);

    return {
      message: 'Access Token 재발급 성공',
      AccessToken: newJwtAccess,
      a: refreshToken,
    };
  }

  //AccessToken 발급
  getAccessToken(user: User) {
    return this.jwtService.sign(
      {
        id: user.id,
      },
      { secret: process.env.SECRET_KEY_ACCESS, expiresIn: '1h' },
    );
  }

  //refreshToken 발급
  getRefreshToken(user: User) {
    return this.jwtService.sign(
      {
        id: user.id,
      },
      { secret: process.env.SECRET_KEY_REFRESH, expiresIn: '2w' },
    );
  }

  //회원탈퇴

  async deleteUser(id: number) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new BadRequestException(
        '해당 계정이 존재하지 않아 삭제할 수 없습니다.',
      );
    }
    await this.userRepository.deleteUser(id);
    return { message: `${user.loginId} 계정이 회원 탈퇴 되었습니다.` };
  }
}
