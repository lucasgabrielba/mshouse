import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../infra/database/database.module';
import { EntrypointModule } from './company/entrypoint/entrypoint.module';
import { RepositoryModule } from '../infra/database/repositories/repository.module';
import { ORMModule } from '../infra/database/entities/orm.module';
import { MSCompanyModule } from 'msHouse.module';

@Module({
  imports: [
    ORMModule,
    ConfigModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    MSCompanyModule,
    EntrypointModule,
    RepositoryModule,
  ],
})
export class AppModule {}
