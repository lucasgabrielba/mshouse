import { Injectable } from '@nestjs/common';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import { CompanyDomainService } from '../../../company/domain/domainService/CompanyDomainService';
import { CompanyRepository } from '../../../infra/database/repositories/CompanyRepository';

@Injectable()
export class CompanyEntrypoint {
  protected static instance: CompanyApplicationService;

  constructor(repository: CompanyRepository) {
    if (!CompanyEntrypoint.instance) {
      const domainService = new CompanyDomainService(repository);
      CompanyEntrypoint.instance = new CompanyApplicationService(domainService);
    }
  }

  getApplicationService(): CompanyApplicationService {
    return CompanyEntrypoint.instance;
  }
}
