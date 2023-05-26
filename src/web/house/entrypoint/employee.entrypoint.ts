import { Injectable } from '@nestjs/common';
import { EmployeeApplicationService } from '../../../house/application/service/EmployeeApplicationService';
import { EmployeeDomainService } from '../../../house/domain/domainService/EmployeeDomainService';
import { EmployeeRepository } from '../../../infra/database/repositories/EmployeeRepository';
import { HouseRepository } from '../../../infra/database/repositories/HouseRepository';
import { HouseApplicationService } from '../../../house/application/service/HouseApplicationService';
import { HouseDomainService } from '../../../house/domain/domainService/HouseDomainService';

@Injectable()
export class EmployeeEntrypoint {
  protected static instance: EmployeeApplicationService;
  protected static houseAppService: HouseApplicationService;

  constructor(
    repository: EmployeeRepository,
    houseRepository: HouseRepository,
  ) {
    if (!EmployeeEntrypoint.instance) {
      const houseDomainService = new HouseDomainService(houseRepository);
      const houseAppService = new HouseApplicationService(houseDomainService);
      const domainService = new EmployeeDomainService(repository);
      EmployeeEntrypoint.instance = new EmployeeApplicationService(
        domainService,
        houseAppService,
      );
    }
  }

  getApplicationService(): EmployeeApplicationService {
    return EmployeeEntrypoint.instance;
  }
}
