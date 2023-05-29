import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { CompanyDTOPrimitive } from '../../DTO/CompanyDTO';
import { CompanyDomainService } from '../../domain/domainService/CompanyDomainService';
import { CreateCompanyPropsPrimitive, Company, UpdateCompanyPropsPrimitive } from '../../domain/entities/Company';

export class CompanyApplicationService extends AbstractApplicationService<
  Company,
  CompanyDTOPrimitive,
  CreateCompanyPropsPrimitive,
  CompanyDomainService
> {
  constructor(readonly manager: CompanyDomainService) {
    super(manager);
  }

  async create(data: CreateCompanyPropsPrimitive): Promise<Result<Company>> {
    const companyExist = await this.get({ email: data.email });

    if (companyExist.isSuccess()) {
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
    data: UpdateCompanyPropsPrimitive,
  ): Promise<Result<Company>> {
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

  async getById(id: string): Promise<Result<Company>> {
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

    return Result.ok<Company>(retrieved.data);
  }

  async all(): Promise<Result<Company[]>> {
    const result = await this.manager.find();

    return result
  }

  async filter(where?: object): Promise<Result<Company[]>> {
    const fetched = await this.manager.filter(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível resgatar registros de "${this.getModelLabel()}".`,
        ),
      );
    }

    return Result.ok<Company[]>(fetched.data);
  }

  getModelLabel(): string {
    return Company.LABEL;
  }
}
