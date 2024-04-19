import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from 'src/auth/dtos/create-user-dto';
import { LoginDto } from 'src/auth/dtos/login-dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.findOne({ where: { id: id } });
    return user;
  }

  async findUserByLoginId(loginId: string): Promise<User> {
    const user = await this.findOne({ where: { loginId: loginId } });
    return user;
  }

  async saveJwtRefresh(loginDto: LoginDto, jwtRefresh: string) {
    const user = await this.findUserByLoginId(loginDto.loginId);
    user.jwtRefresh = jwtRefresh;
    await this.save(user);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.create({ ...createUserDto });
    await this.save(newUser);
    return newUser;
  }

  async deleteUser(id: number) {
    const user = await this.findUserById(id);
    await this.remove(user);
  }
}
