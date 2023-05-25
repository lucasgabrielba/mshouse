import { Module, Global } from '@nestjs/common';
import { HouseEntrypoint } from './house.entrypoint';
import { EmployeeEntrypoint } from './employee.entrypoint';

@Global()
@Module({
  providers: [HouseEntrypoint, EmployeeEntrypoint],
  exports: [HouseEntrypoint, EmployeeEntrypoint],
})
export class EntrypointModule {}
