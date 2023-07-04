import { Module, Global } from '@nestjs/common';
import { CompanyRepository } from './CompanyRepository';
import { MemberRepository } from './MemberRepository';
import { ORMCompany } from '../entities/ORMCompany';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ORMMember } from '../entities/ORMMember';
import { ORMAddress } from '../entities/ORMAddress';
import { AddressRepository } from './AddressRepository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ORMCompany, ORMMember, ORMAddress])],
  providers: [CompanyRepository, MemberRepository, AddressRepository],
  exports: [CompanyRepository, MemberRepository, AddressRepository],
})
export class RepositoryModule {}
