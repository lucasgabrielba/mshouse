import { Injectable } from '@nestjs/common';
import { UserApplicationService } from '../../../company/application/service/UserApplicationService';
import { UserDomainService } from '../../../company/domain/domainService/UserDomainService';
import { UserRepository } from '../../../infra/database/repositories/UserRepository';
import { CompanyRepository } from '../../../infra/database/repositories/CompanyRepository';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import { CompanyDomainService } from '../../../company/domain/domainService/CompanyDomainService';

@Injectable()
export class UserEntrypoint {
  protected static instance: UserApplicationService;
  protected static companyAppService: CompanyApplicationService;

  constructor(
    repository: UserRepository,
    companyRepository: CompanyRepository,
  ) {
    if (!UserEntrypoint.instance) {
      const companyDomainService = new CompanyDomainService(companyRepository);
      const companyAppService = new CompanyApplicationService(companyDomainService);
      const domainService = new UserDomainService(repository);
      UserEntrypoint.instance = new UserApplicationService(
        domainService,
        companyAppService,
      );
    }
  }

  getApplicationService(): UserApplicationService {
    return UserEntrypoint.instance;
  }
}
