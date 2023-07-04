import { Module, Global } from '@nestjs/common';
import { CompanyRepository } from './CompanyRepository';
import { MemberRepository } from './MemberRepository';
import { ORMCompany } from '../entities/ORMCompany';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMMember } from '../entities/ORMMember';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ORMCompany, ORMMember])],
  providers: [CompanyRepository, MemberRepository],
  exports: [CompanyRepository, MemberRepository],
})
export class RepositoryModule {}
