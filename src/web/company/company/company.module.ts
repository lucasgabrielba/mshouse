import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMCompany } from '../../../infra/database/entities/ORMCompany';

@Module({
  imports: [TypeOrmModule.forFeature([ORMCompany])],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
