import { Injectable } from '@nestjs/common';
import { HouseApplicationService } from '../../../house/application/service/HouseApplicationService';
import { HouseDomainService } from '../../../house/domain/domainService/HouseDomainService';
import { HouseRepository } from '../../../infra/database/repositories/HouseRepository';

@Injectable()
export class HouseEntrypoint {
  protected static instance: HouseApplicationService;

  constructor(repository: HouseRepository) {
    if (!HouseEntrypoint.instance) {
      const domainService = new HouseDomainService(repository);
      HouseEntrypoint.instance = new HouseApplicationService(domainService);
    }
  }

  getApplicationService(): HouseApplicationService {
    return HouseEntrypoint.instance;
  }
}
