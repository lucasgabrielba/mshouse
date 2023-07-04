import { Injectable } from '@nestjs/common';
import { AddressApplicationService } from '../../../company/application/service/AddressApplicationService';
import { AddressDomainService } from '../../../company/domain/domainService/AddressDomainService';
import { AddressRepository } from '../../../infra/database/repositories/AddressRepository';

@Injectable()
export class AddressEntrypoint {
  protected static instance: AddressApplicationService;

  constructor(repository: AddressRepository) {
    if (!AddressEntrypoint.instance) {
      const domainService = new AddressDomainService(repository);
      AddressEntrypoint.instance = new AddressApplicationService(domainService);
    }
  }

  getApplicationService(): AddressApplicationService {
    return AddressEntrypoint.instance;
  }
}
