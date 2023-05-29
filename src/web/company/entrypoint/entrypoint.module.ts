import { Module, Global } from '@nestjs/common';
import { CompanyEntrypoint } from './company.entrypoint';
import { UserEntrypoint } from './user.entrypoint';

@Global()
@Module({
  providers: [CompanyEntrypoint, UserEntrypoint],
  exports: [CompanyEntrypoint, UserEntrypoint],
})
export class EntrypointModule {}
