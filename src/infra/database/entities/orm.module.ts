import { Module, Global } from '@nestjs/common';
import { ORMCompany } from './ORMCompany';
import { ORMMember } from './ORMMember';
import { ORMAddress } from './ORMAddress';

@Global()
@Module({
  providers: [ORMCompany, ORMMember, ORMAddress],
  exports: [ORMCompany, ORMMember, ORMAddress],
})
export class ORMModule {}
