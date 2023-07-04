import { Result } from '../../../../kernel/Result/Result';
import { AbstractApplicationService } from '../../../../kernel/application/service/AbstactApplicationService';
import { isUUID } from '../../../../kernel/isUUID/isUUID';
import { MemberDTOPrimitive } from '../../DTO/MemberDTO';
import { MemberDomainService } from '../../domain/domainService/MemberDomainService';
import {
  Member,
  CreateMemberPropsPrimitive,
  UpdateMemberPropsPrimitive,
} from '../../domain/entities/Member';
import { CompanyApplicationService } from './CompanyApplicationService';

export class MemberApplicationService extends AbstractApplicationService<
  Member,
  MemberDTOPrimitive,
  CreateMemberPropsPrimitive,
  MemberDomainService
> {
  constructor(
    readonly manager: MemberDomainService,
    protected companyApplicationService: CompanyApplicationService,
  ) {
    super(manager);
  }

  async create(data: CreateMemberPropsPrimitive): Promise<Result<Member>> {

    const memberExist = await this.get(
      { email: data.email },
    );

    if (memberExist.isSuccess()) {
      return Result.fail(new Error(`Já existe usuário criado com esse e-mail.`));
    }

    const company = await this.companyApplicationService.getById(data.companyId);

    if (company.isFailure()) {
      return Result.fail(company.error);
    }

    const createData = {
      ...data,
      company: company.data,
    }; delete createData.companyId

    const result = await this.manager.createAndSave(createData);

    if (result.isFailure()) {
      return Result.fail(result.error);
    }

    return result;
  }

  async updateEntity(
    id: string,
    data: UpdateMemberPropsPrimitive,
  ): Promise<Result<Member>> {
    const entity = await this.getById(id);

    if (entity.isFailure()) {
      return Result.fail(new Error('não foi possivel resgatar member'));
    }

    const updateData = {
      ...entity.data.toDTO(),
      ...data,
      password: data.password
        ? data.password
        : entity.data.password,
      refresh_token: data.refresh_token === null
        ? null : data.refresh_token
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


  async getById(id: string): Promise<Result<Member>> {
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

  async findByEmail(email: string): Promise<Result<Member>> {
    const result = await this.get(
      { email: email }
    )

    if (result.isFailure()) {
      return Result.fail(new Error('E-mail ou senha inválida'))
    }

    return result
  }

  async get(where: object): Promise<Result<Member>> {
    const fetched = await this.manager.getOne(where);

    if (fetched.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível resgatar "${this.getModelLabel()}".`),
      );
    }

    return Result.ok<Member>(fetched.data);
  }

  async all(): Promise<Result<Member[]>> {
    const result = await this.manager.find();
    return result
  }

  async filter(where: object): Promise<Result<Member[]>> {
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
    return Member.LABEL;
  }
}
