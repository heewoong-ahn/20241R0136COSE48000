import { Injectable, NotFoundException } from '@nestjs/common';
import { Top } from 'src/entities/clothes/tops.entity';
import { User } from 'src/entities/users.entity';
import { UploadTopDto } from 'src/top/dtos/upload-top.dto';
import { DataSource, Repository } from 'typeorm';
import { ResponseTopDto } from 'src/top/dtos/response-top.dto';

@Injectable()
export class TopRepository extends Repository<Top> {
  constructor(dataSource: DataSource) {
    super(Top, dataSource.createEntityManager());
  }

  async uploadTop(s3Url: string, userId: number, uploadTopDto: UploadTopDto) {
    const user = new User();
    user.id = userId;
    const top = this.create({
      url: s3Url,
      type: uploadTopDto.type,
      memo: uploadTopDto.memo,
      user: user,
    });
    return new ResponseTopDto(await this.save(top));
  }
}
