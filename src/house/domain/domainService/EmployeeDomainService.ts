import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { EmployeeDTO } from '../../DTO/EmployeeDTO';
import { Employee, CreateEmployeeProps } from '../entities/Employee';
import { EmployeeRepositoryInterface } from '../repository/EmployeeRepositoryInterface';

export class EmployeeDomainService extends AbstractDomainService<
  Employee,
  EmployeeDTO,
  CreateEmployeeProps,
  EmployeeRepositoryInterface
> {
  constructor(protected repository: EmployeeRepositoryInterface) {
    super(repository);
  }

  async getOne(where: object): Promise<Result<Employee>> {
    const fetched = await this.repository.findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Employee>(fetched.data);
  }

  async create(data: CreateEmployeeProps): Promise<Result<Employee>> {
    const created = Employee.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Employee>(created.data);
  }

  async update(data: EmployeeDTO): Promise<Result<Employee>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Employee.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;

    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar ${Employee.LABEL}".`),
      );
    }

    return Result.ok<Employee>(instance);
  }

  async build(data: EmployeeDTO): Promise<Result<Employee>> {
    const created = Employee.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Employee>(created.data);
  }
}
