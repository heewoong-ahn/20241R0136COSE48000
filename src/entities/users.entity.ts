import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Generated,
  OneToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
import { At } from './at.entity';
import { Mannequin } from './mannequins.entity';
import { Top } from './clothes/tops.entity';
import { Pant } from './clothes/pants.entity';
import { Shoe } from './clothes/shoes.entity';
import { Accessory } from './clothes/accessories.entity';
import { UserTopSave } from './save-clothes/user-top-save.entity';
import { UserShoeSave } from './save-clothes/user-shoe-save.entity';
import { UserPantSave } from './save-clothes/user-pant-save.entity';
import { UserAccessorySave } from './save-clothes/user-accessory-save.entity';
import { LookBook } from './lookbooks.entity';
import { UserLookBookSave } from './save-clothes/user-lookbook-save.entity';
import { UserLookBookLike } from './user-lookbook-like.entity';
import { Comment } from './comments.entity';
import { Follow } from './follows.entity';
import { UserChatRoom } from './user-chatrooms.entity';

@Entity()
export class User extends At {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  loginId: string;

  @Column('varchar')
  password: string;

  @Column('varchar')
  phoneNumber: string;

  @Column('varchar')
  nickname: string;

  @Column('uuid')
  @Generated('uuid')
  uuid: string;

  @Column('varchar', { nullable: true })
  jwtRefresh: string;

  @OneToMany(() => Top, (top) => top.user)
  tops: Top[];

  @OneToMany(() => Pant, (pant) => pant.user)
  pants: Pant[];

  @OneToMany(() => Shoe, (shoe) => shoe.user)
  shoes: Shoe[];

  @OneToMany(() => Accessory, (accessory) => accessory.user)
  accessories: Accessory[];

  @OneToMany(() => UserTopSave, (userTopSave) => userTopSave.user)
  userTopSaves: UserTopSave[];

  @OneToMany(() => UserShoeSave, (userShoeSave) => userShoeSave.user)
  userShoeSaves: UserShoeSave[];

  @OneToMany(() => UserPantSave, (userPantSave) => userPantSave.user)
  userPantSaves: UserPantSave[];

  @OneToMany(
    () => UserAccessorySave,
    (userAccessorySave) => userAccessorySave.user,
  )
  userAccessorySaves: UserAccessorySave[];

  @OneToMany(() => LookBook, (lookbook) => lookbook.user)
  lookbooks: LookBook[];

  @OneToMany(
    () => UserLookBookSave,
    (userLookBookSave) => userLookBookSave.user,
  )
  userLookBookSaves: UserLookBookSave[];

  @OneToMany(
    () => UserLookBookLike,
    (userLookBookLike) => userLookBookLike.user,
  )
  userLookBookLikes: UserLookBookLike[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  //팔로워들을 찾고 싶으면 follow 테이블에서 본인의 user_id가 followed_id여야 함.
  @OneToMany(() => Follow, (follow) => follow.followed_id)
  followers: Follow[];

  @OneToMany(() => Follow, (follow) => follow.follower_id)
  followings: Follow[];

  @OneToMany(() => UserChatRoom, (userChatRoom) => userChatRoom.user)
  userChatRooms: UserChatRoom[];

  // @OneToOne(() => Mannequin, (mannequin) => mannequin.user, { cascade: true })
  // mannequin: Mannequin;
  // @RelationId((user: User) => user.mannequin)
  // @Column({ nullable: true })
  // mannequinId: number;
}
