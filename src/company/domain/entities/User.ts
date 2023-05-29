import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import { UserDTO } from '../../DTO/UserDTO';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { UserType } from '../enum/UserType';
import { Company } from './Company';
import { hashSync } from 'bcrypt';

export interface CreateUserPropsPrimitive {
  name: string;
  email: string;
  password: string;
  type: UserType;
  companyId: string;
}

export interface UpdateUserPropsPrimitive
  extends Partial<CreateUserPropsPrimitive> {}

export interface CreateUserProps {
  name: string;
  email: string;
  password: string;
  type: UserType;
  company: Company;
}

export interface UserProps extends CreateUserProps, AuditableProps {}

export class User extends Auditable {
  constructor(protected props: UserProps) {
    super(props);
  }

  public static readonly LABEL: string = 'User';

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get type(): UserType {
    return this.props.type;
  }

  get company(): Company {
    return this.props.company;
  }

  static create(props: CreateUserProps): Result<User> {
    const validated = User.validate({
      id: v4(),
      name: props.name,
      email: props.email,
      password: hashSync(props.password, 10),
      type: UserType[props.type],
      company: props.company,
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new User(validated.data));
  }

  static reconstitute(props: UserDTO): Result<User> {
    const validated = User.validate({
      ...props,
      id: props.id ?? v4(),
      name: props.name,
      email: props.email,
      password: props.password,
      type: UserType[props.type],
      company: Company.reconstitute(props.company).data,
      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<User>(new User(validated.data));
  }

  static validate(data: UserProps): Result<UserProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(255).required(),
      email: Joi.string().email().min(1).max(255).required(),
      password: Joi.string().min(8).max(255).required(),
      type: Joi.string()
        .valid(
          UserType.MANAGER,
          UserType.TECHNIQUE,
          UserType.ATTENDANT,
        )
        .required(),
      company: Joi.object().instance(Company).required(),
      createdAt: Joi.object().instance(Date).required(),
      updatedAt: Joi.object().instance(Date).optional(),
      deletedAt: Joi.object().instance(Date).optional(),
    };

    const { value, error } = Joi.object(schema).unknown().validate(data);

    if (error) {
      return Result.fail(error);
    }

    return Result.ok(value);
  }

  toDTO(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      type: this.type,
      company: this.company.toDTO(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
