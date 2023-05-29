import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { CompanyDTO } from '../../DTO/CompanyDTO';
import { CreateCompanyProps, Company } from '../entities/Company';
import { CompanyRepositoryInterface } from '../repository/CompanyRepositoryInterface';

export class CompanyDomainService extends AbstractDomainService<
  Company,
  CompanyDTO,
  CreateCompanyProps,
  CompanyRepositoryInterface
> {
  constructor(protected repository: CompanyRepositoryInterface) {
    super(repository);
  }

  async create(data: CreateCompanyProps): Promise<Result<Company>> {
    const created = Company.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Company>(created.data);
  }

  async find(): Promise<Result<Company[]>> {
    const fetched = await this.repository.findEntity();

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok(fetched.data);
  }


  async update(data: CompanyDTO): Promise<Result<Company>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Company.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;
    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(new Error(`Não foi possível salvar ${Company.LABEL}".`));
    }

    return Result.ok<Company>(instance);
  }

  async build(data: CompanyDTO): Promise<Result<Company>> {
    const created = Company.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Company>(created.data);
  }
}
