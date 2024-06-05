import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessoryLookBook } from 'src/entities/accessory-lookbook.entity';
import { LookBook } from 'src/entities/lookbooks.entity';
import { UserLookBookSave } from 'src/entities/save-clothes/user-lookbook-save.entity';
import { TopLookBook } from 'src/entities/top-lookbook.entity';
import { UserLookBookLike } from 'src/entities/user-lookbook-like.entity';
import { LookbookController } from './lookbook.controller';
import { LookbookService } from './lookbook.service';
import { User } from 'src/entities/users.entity';
import { Top } from 'src/entities/clothes/tops.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { LookBookRepository } from 'src/repositories/lookbooks.repository';
import { TopLookBookRepository } from 'src/repositories/top-lookbooks.repository';
import { AccessoryLookBookRepository } from 'src/repositories/accessory-lookbooks.repository';
import { UserLookBookSaveRepository } from 'src/repositories/user-lookbook-save.repository';
import { UserLookBookLikeRepository } from 'src/repositories/user-lookbook-like.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LookBook,
      TopLookBook,
      AccessoryLookBook,
      UserLookBookLike,
      UserLookBookSave,
      User,
      Top,
      Accessory,
      Pant,
      Shoe,
    ]),
  ],
  controllers: [LookbookController],
  providers: [
    LookbookService,
    LookBookRepository,
    TopLookBookRepository,
    AccessoryLookBookRepository,
    UserLookBookSaveRepository,
    UserLookBookLikeRepository,
  ],
})
export class LookbookModule {}
