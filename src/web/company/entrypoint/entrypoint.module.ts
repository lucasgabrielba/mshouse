import { Module, Global } from '@nestjs/common';
import { CompanyEntrypoint } from './company.entrypoint';
import { MemberEntrypoint } from './member.entrypoint';

@Global()
@Module({
  providers: [CompanyEntrypoint, MemberEntrypoint],
  exports: [CompanyEntrypoint, MemberEntrypoint],
})
export class EntrypointModule {}
