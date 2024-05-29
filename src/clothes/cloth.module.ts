import { Module } from '@nestjs/common';

import { S3Service } from 'src/s3/s3.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Top } from 'src/entities/clothes/tops.entity';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access';
import { User } from 'src/entities/users.entity';
import { TopRepository } from 'src/repositories/tops.repository';
import { UserTopSaveRepository } from 'src/repositories/user-top-save.repository';
import { UserTopSave } from 'src/entities/save-clothes/user-top-save.entity';
import { ClothController } from './cloth.controller';
import { ClothService } from './cloth.service';
import { Pant } from 'src/entities/clothes/pants.entity';
import { Shoe } from 'src/entities/clothes/shoes.entity';
import { Accessory } from 'src/entities/clothes/accessories.entity';
import { TopService } from './tops.service';
import { ShoeService } from './shoes.service';
import { PantService } from './pants.service';
import { AccessoryService } from './accessories.service';
import { ShoeRepository } from 'src/repositories/shoes.repository';
import { PantRepository } from 'src/repositories/pants.repository';
import { AccessoryRepository } from 'src/repositories/accessories.repository';
import { UserShoeSaveRepository } from 'src/repositories/user-shoe-save.repository';
import { UserPantSaveRepository } from 'src/repositories/user-pant-save.repository';
import { UserAccessorySaveRepository } from 'src/repositories/user-accessory-save.repository';
import { UserPantSave } from 'src/entities/save-clothes/user-pant-save.entity';
import { UserShoeSave } from 'src/entities/save-clothes/user-shoe-save.entity';
import { UserAccessorySave } from 'src/entities/save-clothes/user-accessory-save.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Top,
      Pant,
      Shoe,
      Accessory,
      User,
      UserTopSave,
      UserPantSave,
      UserShoeSave,
      UserAccessorySave,
    ]),
  ],
  controllers: [ClothController],
  providers: [
    ClothService,
    TopService,
    ShoeService,
    PantService,
    AccessoryService,
    TopRepository,
    ShoeRepository,
    PantRepository,
    AccessoryRepository,
    UserTopSaveRepository,
    UserShoeSaveRepository,
    UserPantSaveRepository,
    UserAccessorySaveRepository,
    S3Service,
    JwtAccessStrategy,
  ],
})
export class ClothModule {}
