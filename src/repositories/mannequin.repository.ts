import { Injectable, NotFoundException } from '@nestjs/common';
import { Mannequin } from 'src/entities/mannequins.entity';
import { AdjustMannequinDto } from 'src/mannequin/dtos/adjust-mannequin.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MannequinRepository extends Repository<Mannequin> {
  constructor(dataSource: DataSource) {
    super(Mannequin, dataSource.createEntityManager());
  }

  async adjustMannequin(
    adjustMannequinDto: AdjustMannequinDto,
    userId: number,
  ) {
    const mannequin = await this.findOne({ where: { user_id: userId } });

    if (!mannequin) {
      throw new NotFoundException('해당 마네킹이 존재하지 않습니다.');
    }

    for (const key in adjustMannequinDto) {
      mannequin[key] = adjustMannequinDto[key];
    }

    return await this.save(mannequin);
  }

  async getMannequin(userId: number) {
    const mannequin = await this.findOne({ where: { user_id: userId } });

    if (!mannequin) {
      throw new NotFoundException('해당 마네킹이 존재하지 않습니다.');
    }

    return mannequin;
  }
}
