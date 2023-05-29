import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { EntrypointModule } from './entrypoint/entrypoint.module';

@Module({
  imports: [CompanyModule, UserModule],
  providers: [EntrypointModule],
  exports: [CompanyModule, UserModule],
})
export class MSCompanyModule {}
