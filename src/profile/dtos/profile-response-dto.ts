import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/entities/users.entity';

export class OtherUserProfileResponseDto {
  @ApiProperty({ example: '희웅' })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ example: '10' })
  @IsInt()
  @IsNotEmpty()
  lookBookCnt: number;

  @ApiProperty({ example: '10' })
  @IsInt()
  @IsNotEmpty()
  followerCnt: number;

  @ApiProperty({ example: '10' })
  @IsInt()
  @IsNotEmpty()
  followingCnt: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  followOrNot: boolean;

  constructor(user: User, lookBookCnt: number, followOrNot: boolean = false) {
    this.nickname = user.nickname;
    this.lookBookCnt = lookBookCnt;
    this.followerCnt = user.followerCnt;
    this.followingCnt = user.followingCnt;
    this.followOrNot = followOrNot;
  }
}

//picktype을 쓰면 생성자를 상속받아오지 못해 새로 명시해줘야 함.
export class myProfileResponseDto extends PickType(
  OtherUserProfileResponseDto,
  ['nickname', 'lookBookCnt', 'followerCnt', 'followingCnt'],
) {
  constructor(user: User, lookBookCnt: number) {
    super();
    this.nickname = user.nickname;
    this.lookBookCnt = lookBookCnt;
    this.followerCnt = user.followerCnt;
    this.followingCnt = user.followingCnt;
  }
}
