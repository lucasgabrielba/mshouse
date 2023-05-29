import { Module, Global } from '@nestjs/common';
import { CompanyRepository } from './CompanyRepository';
import { UserRepository } from './UserRepository';
import { ORMCompany } from '../entities/ORMCompany';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMUser } from '../entities/ORMUser';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ORMCompany, ORMUser])],
  providers: [CompanyRepository, UserRepository],
  exports: [CompanyRepository, UserRepository],
})
export class RepositoryModule {}
