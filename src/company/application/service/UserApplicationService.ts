import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { UserDTOPrimitive } from '../../DTO/UserDTO';
import { UserDomainService } from '../../domain/domainService/UserDomainService';
import {
  User,
  CreateUserPropsPrimitive,
  UpdateUserPropsPrimitive,
} from '../../domain/entities/User';
import { CompanyApplicationService } from './CompanyApplicationService';

export class UserApplicationService extends AbstractApplicationService<
  User,
  UserDTOPrimitive,
  CreateUserPropsPrimitive,
  UserDomainService
> {
  constructor(
    readonly manager: UserDomainService,
    protected companyApplicationService: CompanyApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateUserPropsPrimitive): Promise<Result<User>> {
    const userExist = await this.get(
      { email: data.email },
    );

    if (userExist.isSuccess()) {
      return Result.fail(new Error(`Já existe usuário criado com esse e-mail.`));
    }

    const company = await this.companyApplicationService.getById(data.companyId);

    if (company.isFailure()) {
      return Result.fail(company.error);
    }

    const createData = {
      ...data,
      company: company.data,
    };

    const result = await this.manager.createAndSave(createData);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateUserPropsPrimitive,
  ): Promise<Result<User>> {
    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar user'));
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

  async getById(id: string): Promise<Result<User>> {
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

  async get(where: object): Promise<Result<User>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<User>(fetched.data);
  }

  async all(): Promise<Result<User[]>> {
    const result = await this.manager.find();
    return result
  }

  async filter(where: object): Promise<Result<User[]>> {
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
    return User.LABEL;
  }
}
