import { Injectable } from '@nestjs/common';
import { MannequinRepository } from 'src/repositories/mannequin.repository';
import { AdjustMannequinDto } from './dtos/adjust-mannequin.dto';

@Injectable()
export class MannequinService {
  constructor(private readonly mannequinRepository: MannequinRepository) {}

  async adjustMannequin(
    adjustMannequinDto: AdjustMannequinDto,
    userId: number,
  ) {
    return await this.mannequinRepository.adjustMannequin(
      adjustMannequinDto,
      userId,
    );
  }

  async getMannequin(userId: number) {
    return await this.mannequinRepository.getMannequin(userId);
  }
}
