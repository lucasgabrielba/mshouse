import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { HouseDTOPrimitive } from '../../DTO/HouseDTO';
import { HouseDomainService } from '../../domain/domainService/HouseDomainService';
import { CreateHousePropsPrimitive, House, UpdateHousePropsPrimitive } from '../../domain/entities/House';

export class HouseApplicationService extends AbstractApplicationService<
  House,
  HouseDTOPrimitive,
  CreateHousePropsPrimitive,
  HouseDomainService
> {
  constructor(readonly manager: HouseDomainService) {
    super(manager);
  }

  async create(data: CreateHousePropsPrimitive): Promise<Result<House>> {
    const houseExist = await this.get({ email: data.email });

    if (houseExist.isSuccess()) {
      return Result.fail(new Error('Email já cadastrado para um empresa'));
    }

    const result = await this.manager.createAndSave(data);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateHousePropsPrimitive,
  ): Promise<Result<House>> {
    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(entity.error);
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

  async getById(id: string): Promise<Result<House>> {
    const isValid = isUUID(id);

    if (!isValid) {
      return Result.fail(new Error('O id fornecido de empresa não é válido.'));
    }

    const retrieved = await this.manager.get(id);
    if (retrieved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<House>(retrieved.data);
  }

  async all(): Promise<Result<House[]>> {
    const result = await this.manager.find();

    return result
  }

  async filter(where?: object): Promise<Result<House[]>> {
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
