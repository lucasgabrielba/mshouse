import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { EmployeeDTOPrimitive } from '../../DTO/EmployeeDTO';
import { EmployeeDomainService } from '../../domain/domainService/EmployeeDomainService';
import {
  Employee,
  CreateEmployeePropsPrimitive,
} from '../../domain/entities/Employee';

export class EmployeeApplicationService extends AbstractApplicationService<
  Employee,
  EmployeeDTOPrimitive,
  CreateEmployeePropsPrimitive,
  EmployeeDomainService
> {
  constructor(readonly manager: EmployeeDomainService) {
    super(manager);
  }

  async getById(id: string): Promise<Result<Employee>> {
    const isValid = isUUID(id);

    if (!isValid) {
      return Result.fail(new Error('O id fornecido não é válido.'));
    }

    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(retrieved.data);
  }

  async get(where: object): Promise<Result<Employee>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Employee>(fetched.data);
  }

  async all(where?: object): Promise<Result<Employee[]>> {
    return this.filter(where as any);
  }

  async filter(where: object): Promise<Result<Employee[]>> {
    const fetched = await this.manager.filter(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok(fetched.data);
  }

  getModelLabel(): string {
    return Employee.LABEL;
  }
}
