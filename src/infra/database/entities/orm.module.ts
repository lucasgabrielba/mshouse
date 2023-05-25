import { Module, Global } from '@nestjs/common';
import { ORMHouse } from './ORMHouse';
import { ORMEmployee } from './ORMEmployee';

@Global()
@Module({
  providers: [ORMHouse, ORMEmployee],
  exports: [ORMHouse, ORMEmployee],
})
export class ORMModule {}
