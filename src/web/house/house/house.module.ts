import { Module } from '@nestjs/common';
import { HouseService } from './house.service';
import { HouseController } from './house.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMHouse } from '../../../infra/database/entities/ORMHouse';

@Module({
  imports: [TypeOrmModule.forFeature([ORMHouse])],
  providers: [HouseService],
  controllers: [HouseController],
})
export class HouseModule {}
