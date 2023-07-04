import { Module, Global } from '@nestjs/common';
import { ORMCompany } from './ORMCompany';
import { ORMMember } from './ORMMember';

@Global()
@Module({
  providers: [ORMCompany, ORMMember],
  exports: [ORMCompany, ORMMember],
})
export class ORMModule {}
