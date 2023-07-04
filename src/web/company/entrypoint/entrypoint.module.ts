import { Module, Global } from '@nestjs/common';
import { CompanyEntrypoint } from './company.entrypoint';
import { MemberEntrypoint } from './member.entrypoint';
import { AddressEntrypoint } from './address.entrypoint';

@Global()
@Module({
  providers: [CompanyEntrypoint, MemberEntrypoint, AddressEntrypoint],
  exports: [CompanyEntrypoint, MemberEntrypoint, AddressEntrypoint],
})
export class EntrypointModule {}
