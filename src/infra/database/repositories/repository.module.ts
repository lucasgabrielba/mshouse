import { Module, Global } from '@nestjs/common';
import { HouseRepository } from './HouseRepository';
import { EmployeeRepository } from './EmployeeRepository';
import { ORMHouse } from '../entities/ORMHouse';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMEmployee } from '../entities/ORMEmployee';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ORMHouse, ORMEmployee])],
  providers: [HouseRepository, EmployeeRepository],
  exports: [HouseRepository, EmployeeRepository],
})
export class RepositoryModule {}
