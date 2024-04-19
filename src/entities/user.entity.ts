import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Generated,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
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
}
