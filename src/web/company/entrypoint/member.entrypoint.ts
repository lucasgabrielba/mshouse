import { MemberApplicationService } from '../../../company/application/service/MemberApplicationService';
import { MemberDomainService } from '../../../company/domain/domainService/MemberDomainService';
import { MemberRepository } from '../../../infra/database/repositories/MemberRepository';
import { CompanyRepository } from '../../../infra/database/repositories/CompanyRepository';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import { CompanyDomainService } from '../../../company/domain/domainService/CompanyDomainService';
import { Injectable } from '@nestjs/common';
import { CompanyEntrypoint } from './company.entrypoint';

@Injectable()
export class MemberEntrypoint {
  protected static instance: MemberApplicationService;
  protected static companyAppService: CompanyApplicationService;

  constructor(
    repository: MemberRepository,
    companyEntrypoint: CompanyEntrypoint
  ) {
    if (!MemberEntrypoint.instance) {
      const companyAppService = companyEntrypoint.getApplicationService()
      const domainService = new MemberDomainService(repository);
      MemberEntrypoint.instance = new MemberApplicationService(
        domainService,
        companyAppService,
      );
    }
  }

  getApplicationService(): MemberApplicationService {
    return MemberEntrypoint.instance;
  }
}
