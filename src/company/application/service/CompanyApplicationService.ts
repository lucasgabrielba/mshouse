import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { CompanyDTOPrimitive } from '../../DTO/CompanyDTO';
import { CompanyDomainService } from '../../domain/domainService/CompanyDomainService';
import { Address } from '../../domain/entities/Address';
import { CreateCompanyPropsPrimitive, Company, UpdateCompanyPropsPrimitive } from '../../domain/entities/Company';
import { AddressApplicationService } from './AddressApplicationService';

export class CompanyApplicationService extends AbstractApplicationService<
  Company,
  CompanyDTOPrimitive,
  CreateCompanyPropsPrimitive,
  CompanyDomainService
> {
  constructor(readonly manager: CompanyDomainService,
    protected readonly addressAppService: AddressApplicationService) {
    super(manager);
  }

  async create(data: CreateCompanyPropsPrimitive): Promise<Result<Company>> {
    const companyExist = await this.get({ email: data.email });

    if (companyExist.isSuccess()) {
      return Result.fail(new Error('Email já cadastrado para um empresa'));
    }

    const address = await this.addressAppService.create(data.address)

    if (address.isFailure()) {
      return Result.fail(address.error);
    }

    const result = await this.manager.createAndSave({ ...data, address: address.data });

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

    let address: Result<Address> = Result.ok(entity.data.address)
    if (data.address) {
      address = await this.addressAppService
        .updateEntity(entity.data.address.id, data.address)
    }

    const updateData = {
      ...entity.data.toDTO(),
      ...data,
      address: address.data.toDTO()
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
