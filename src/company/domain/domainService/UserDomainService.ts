import { Result } from '../../../../kernel/Result/Result';
import { AbstractDomainService } from '../../../../kernel/domain/domainService/AbstractDomainService';
import { UserDTO } from '../../DTO/UserDTO';
import { User, CreateUserProps } from '../entities/User';
import { UserRepositoryInterface } from '../repository/UserRepositoryInterface';

export class UserDomainService extends AbstractDomainService<
  User,
  UserDTO,
  CreateUserProps,
  UserRepositoryInterface
> {
  constructor(protected repository: UserRepositoryInterface) {
    super(repository);
  }

  async getOne(where: object): Promise<Result<User>> {
    const fetched = await this.repository.findOneEntity(where);

    if (fetched.isFailure()) {
      return Result.fail(fetched.error);
    }

    return Result.ok<User>(fetched.data);
  }

  async create(data: CreateUserProps): Promise<Result<User>> {
    const created = User.create(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<User>(created.data);
  }

  async update(data: UserDTO): Promise<Result<User>> {
    const built = await this.build(data);

    if (built.isFailure()) {
      return Result.fail(
        new Error(
          `Não foi possível construir ${User.LABEL} a partir dos dados informados.`,
        ),
      );
    }

    const instance = built.data;

    const saved = await this.save(instance);

    if (saved.isFailure()) {
      return Result.fail(
        new Error(`Não foi possível salvar ${User.LABEL}".`),
      );
    }

    return Result.ok<User>(instance);
  }

  async build(data: UserDTO): Promise<Result<User>> {
    const created = User.reconstitute(data);

    if (created.isFailure()) {
      return Result.fail(created.error);
    }

    return Result.ok<User>(created.data);
  }
}
