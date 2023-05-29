import { Module, Global } from '@nestjs/common';
import { ORMCompany } from './ORMCompany';
import { ORMUser } from './ORMUser';

@Global()
@Module({
  providers: [ORMCompany, ORMUser],
  exports: [ORMCompany, ORMUser],
})
export class ORMModule {}
