import { Module, forwardRef } from '@nestjs/common';
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
import { CommentService } from 'src/comment/comment.service';
import { CommentModule } from 'src/comment/comment.module';
import { CommentRepository } from 'src/repositories/comment.repository';
import { S3Service } from 'src/s3/s3.service';
import { MannequinLookBookRepository } from 'src/repositories/mannequin-lookbooks.repository';
import { MannequinLookBook } from 'src/entities/mannequin-lookbook.entity';

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
      MannequinLookBook,
    ]),
    CommentModule,
  ],
  controllers: [LookbookController],
  providers: [
    LookbookService,
    LookBookRepository,
    TopLookBookRepository,
    AccessoryLookBookRepository,
    UserLookBookSaveRepository,
    UserLookBookLikeRepository,
    CommentService,
    //CommentService만을 주입받아 쓰지만, CommentService안에서 CommentRepository를 주입받아 쓰므로
    //CommentRepository도 적어줘야 함.
    CommentRepository,
    S3Service,
    MannequinLookBookRepository,
  ],
})
export class LookbookModule {}
