import { Injectable } from '@nestjs/common';
import { EmployeeApplicationService } from '../../../house/application/service/EmployeeApplicationService';
import { EmployeeDomainService } from '../../../house/domain/domainService/EmployeeDomainService';
import { EmployeeRepository } from '../../../infra/database/repositories/EmployeeRepository';

@Injectable()
export class EmployeeEntrypoint {
  protected static instance: EmployeeApplicationService;

  constructor(repository: EmployeeRepository) {
    if (!EmployeeEntrypoint.instance) {
      const domainService = new EmployeeDomainService(repository);
      EmployeeEntrypoint.instance = new EmployeeApplicationService(
        domainService,
      );
    }
  }

  getApplicationService(): EmployeeApplicationService {
    return EmployeeEntrypoint.instance;
  }
}
