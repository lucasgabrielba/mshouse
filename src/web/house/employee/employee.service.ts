import { Injectable } from '@nestjs/common';
import {
  CreateEmployeePropsPrimitive,
  Employee,
  UpdateEmployeePropsPrimitive,
} from '../../../house/domain/entities/Employee';
import { EmployeeApplicationService } from '../../../house/application/service/EmployeeApplicationService';
import { Result } from '../../../../kernel/Result/Result';
import { EmployeeEntrypoint } from '../entrypoint/employee.entrypoint';

@Injectable()
export class EmployeeService {
  protected applicationService: EmployeeApplicationService;

  constructor(entrypoint: EmployeeEntrypoint) {
    this.applicationService = entrypoint.getApplicationService();
  }

  async listAllEmployee(): Promise<Result<Employee[]>> {
    const result = await this.applicationService.all();

    return result;
  }

  async findOne(id: string): Promise<Result<Employee>> {
    return await this.applicationService.getById(id);
  }

  async create(data: CreateEmployeePropsPrimitive): Promise<Result<Employee>> {
    return await this.applicationService.create(data);
  }

  async update(
    id: string,
    data: UpdateEmployeePropsPrimitive,
  ): Promise<Result<Employee>> {
    return await this.applicationService.updateEntity(id, data);
  }

  async delete(id: string): Promise<Result<boolean>> {
    return await this.applicationService.remove(id);
  }
}
