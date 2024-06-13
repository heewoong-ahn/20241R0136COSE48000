import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mannequin } from 'src/entities/mannequins.entity';
import { MannequinController } from './mannequin.controller';
import { MannequinService } from './mannequin.service';
import { JwtAccessStrategy } from 'src/auth/strategies/jwt-access';
import { MannequinRepository } from 'src/repositories/mannequin.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Mannequin])],
  controllers: [MannequinController],
  providers: [MannequinService, MannequinRepository],
})
export class MannequinModule {}
