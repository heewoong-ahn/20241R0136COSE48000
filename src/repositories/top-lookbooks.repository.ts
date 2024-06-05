import { Injectable } from '@nestjs/common';
import { Top } from 'src/entities/clothes/tops.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { TopLookBook } from 'src/entities/top-lookbook.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TopLookBookRepository extends Repository<TopLookBook> {
  constructor(dataSource: DataSource) {
    super(TopLookBook, dataSource.createEntityManager());
  }

  async topToLookbook(top: Top, lookbook: LookBook) {
    const topLookbook = this.create({ top: top, lookbook: lookbook });
    await this.save(topLookbook);
    return;
  }
}
