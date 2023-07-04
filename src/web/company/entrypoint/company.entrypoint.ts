import { Injectable } from '@nestjs/common';
import { CompanyApplicationService } from '../../../company/application/service/CompanyApplicationService';
import { CompanyDomainService } from '../../../company/domain/domainService/CompanyDomainService';
import { CompanyRepository } from '../../../infra/database/repositories/CompanyRepository';
import { AddressEntrypoint } from './address.entrypoint';

@Injectable()
export class CompanyEntrypoint {
  protected static instance: CompanyApplicationService;
  protected static companyAppService: CompanyApplicationService;

  constructor(repository: CompanyRepository, addressEntrypoint: AddressEntrypoint) {
    if (!CompanyEntrypoint.instance) {
      const addressAppService = addressEntrypoint.getApplicationService()
      const domainService = new CompanyDomainService(repository);
      CompanyEntrypoint.instance = new CompanyApplicationService(domainService, addressAppService);
    }
  }

  getApplicationService(): CompanyApplicationService {
    return CompanyEntrypoint.instance;
  }
}
