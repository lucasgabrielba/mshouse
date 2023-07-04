import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { MemberModule } from './member/member.module';
import { EntrypointModule } from './entrypoint/entrypoint.module';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [CompanyModule, MemberModule, AuthModule],
  providers: [EntrypointModule],
  exports: [CompanyModule, MemberModule, AuthModule],
})
export class MSCompanyModule {}
