import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { HouseDTOPrimitive } from '../../DTO/HouseDTO';
import { HouseDomainService } from '../../domain/domainService/HouseDomainService';
import { CreateHousePropsPrimitive, House } from '../../domain/entities/House';

export class HouseApplicationService extends AbstractApplicationService<
  House,
  HouseDTOPrimitive,
  CreateHousePropsPrimitive,
  HouseDomainService
> {
  constructor(readonly manager: HouseDomainService) {
    super(manager);
  }

  async getById(id: string): Promise<Result<House>> {
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

    return Result.ok<House>(retrieved.data);
  }

  async all(where?: object): Promise<Result<House[]>> {
    return this.filter(where as any);
  }

  async filter(where: object): Promise<Result<House[]>> {
    const fetched = await this.manager.filter(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok<House[]>(fetched.data);
  }

  getModelLabel(): string {
    return House.LABEL;
  }
}
