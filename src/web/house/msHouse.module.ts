import { Module } from '@nestjs/common';
import { HouseModule } from './house/house.module';
import { EmployeeModule } from './employee/employee.module';
import { EntrypointModule } from './entrypoint/entrypoint.module';

@Module({
  imports: [HouseModule, EmployeeModule],
  providers: [EntrypointModule],
  exports: [HouseModule, EmployeeModule],
})
export class MSHouseModule {}
