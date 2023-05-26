import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { HouseDTO } from '../../DTO/HouseDTO';
import { CreateHouseProps, House } from '../entities/House';
import { HouseRepositoryInterface } from '../repository/HouseRepositoryInterface';

export class HouseDomainService extends AbstractDomainService<
  House,
  HouseDTO,
  CreateHouseProps,
  HouseRepositoryInterface
> {
  constructor(protected repository: HouseRepositoryInterface) {
    super(repository);
  }

  async create(data: CreateHouseProps): Promise<Result<House>> {
    const created = House.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<House>(created.data);
  }

  async find(): Promise<Result<House[]>> {
    const fetched = await this.repository.findEntity();

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok(fetched.data);
  }


  async update(data: HouseDTO): Promise<Result<House>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${House.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;
    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(new Error(`Não foi possível salvar ${House.LABEL}".`));
    }

    return Result.ok<House>(instance);
  }

  async build(data: HouseDTO): Promise<Result<House>> {
    const created = House.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<House>(created.data);
  }
}
