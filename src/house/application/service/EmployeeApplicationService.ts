import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { EmployeeDTOPrimitive } from '../../DTO/EmployeeDTO';
import { EmployeeDomainService } from '../../domain/domainService/EmployeeDomainService';
import {
  Employee,
  CreateEmployeePropsPrimitive,
  UpdateEmployeePropsPrimitive,
} from '../../domain/entities/Employee';
import { HouseApplicationService } from './HouseApplicationService';

export class EmployeeApplicationService extends AbstractApplicationService<
  Employee,
  EmployeeDTOPrimitive,
  CreateEmployeePropsPrimitive,
  EmployeeDomainService
> {
  constructor(
    readonly manager: EmployeeDomainService,
    protected houseApplicationService: HouseApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateEmployeePropsPrimitive): Promise<Result<Employee>> {
    const employeeExist = await this.get(
      { email: data.email },
    );

    if (employeeExist.isSuccess()) {
      return Result.fail(new Error(`Já existe usuário criado com esse e-mail.`));
    }

    const house = await this.houseApplicationService.getById(data.houseId);

    if (house.isFailure()) {
      return Result.fail(house.error);
    }

    const createData = {
      ...data,
      house: house.data,
    };

    const result = await this.manager.createAndSave(createData);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateEmployeePropsPrimitive,
  ): Promise<Result<Employee>> {
    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar employee'));
    }

    const updateData = {
      ...entity.data.toDTO(),
      ...data,
    };

    const built = await this.manager.build(updateData);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir "${this.getModelLabel()}"` +
          ' a partir dos dados informados.',
        ),
      );
    }

    const instance = built.data;
    const saved = await this.manager.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok(instance);
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

  async all(): Promise<Result<Employee[]>> {
    const result = await this.manager.find();
    return result
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
