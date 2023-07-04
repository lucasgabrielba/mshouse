import { MemberApplicationService } from '../../../company/application/service/MemberApplicationService';
import { MemberDomainService } from '../../../company/domain/domainService/MemberDomainService';
import { MemberRepository } from '../../../infra/database/repositories/MemberRepository';
import { CompanyRepository } from '../../../infra/database/repositories/CompanyRepository';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import { CompanyDomainService } from '../../../company/domain/domainService/CompanyDomainService';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberEntrypoint {
  protected static instance: MemberApplicationService;
  protected static companyAppService: CompanyApplicationService;

  constructor(
    repository: MemberRepository,
    companyRepository: CompanyRepository,
  ) {
    if (!MemberEntrypoint.instance) {
      const companyDomainService = new CompanyDomainService(companyRepository);
      const companyAppService = new CompanyApplicationService(companyDomainService);
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
