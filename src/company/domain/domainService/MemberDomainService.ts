import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { MemberDTO } from '../../DTO/MemberDTO';
import { Member, CreateMemberProps } from '../entities/Member';
import { MemberRepositoryInterface } from '../repository/MemberRepositoryInterface';

export class MemberDomainService extends AbstractDomainService<
  Member,
  MemberDTO,
  CreateMemberProps,
  MemberRepositoryInterface
> {
  constructor(protected repository: MemberRepositoryInterface) {
    super(repository);
  }

  async getOne(where: object): Promise<Result<Member>> {
    const fetched = await this.repository.findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<Member>(fetched.data);
  }

  async create(data: CreateMemberProps): Promise<Result<Member>> {
    const created = Member.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Member>(created.data);
  }

  async update(data: MemberDTO): Promise<Result<Member>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${Member.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;

    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar ${Member.LABEL}".`),
      );
    }

    return Result.ok<Member>(instance);
  }

  async build(data: MemberDTO): Promise<Result<Member>> {
    const created = Member.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<Member>(created.data);
  }
}
