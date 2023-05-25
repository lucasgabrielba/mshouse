import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { ORMEmployee } from '../../../infra/database/entities/ORMEmployee';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ORMEmployee])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
