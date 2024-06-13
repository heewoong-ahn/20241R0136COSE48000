import { Injectable } from '@nestjs/common';
import { AccessoryLookBook } from 'src/entities/accessory-lookbook.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AccessoryLookBookRepository extends Repository<AccessoryLookBook> {
  constructor(dataSource: DataSource) {
    super(AccessoryLookBook, dataSource.createEntityManager());
  }

  async accessoryToLookbook(accessory: Accessory, lookbook: LookBook) {
    const accessoryLookbook = this.create({
      accessory: accessory,
      lookbook: lookbook,
    });
    await this.save(accessoryLookbook);
    return;
  }
}
