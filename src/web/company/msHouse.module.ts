import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { EntrypointModule } from './entrypoint/entrypoint.module';
import { AuthModule } from 'auth/auth.module';

@Module({
  imports: [CompanyModule, UserModule, AuthModule],
  providers: [EntrypointModule],
  exports: [CompanyModule, UserModule, AuthModule],
})
export class MSCompanyModule {}
