import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import { MemberDTO } from '../../DTO/MemberDTO';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { MemberType } from '../enum/MemberType';
import { Company } from './Company';

export interface CreateMemberPropsPrimitive {
  name: string;
  email: string;
  password: string;
  type: MemberType;
  companyId?: string;
  refresh_token?: string;
}

export interface UpdateMemberPropsPrimitive
  extends Partial<CreateMemberPropsPrimitive> {}

export interface CreateMemberProps {
  name: string;
  email: string;
  password: string;
  type: MemberType;
  company: Company;
  refresh_token?: string;
}

export interface MemberProps extends CreateMemberProps, AuditableProps {}

export class Member extends Auditable {
  constructor(protected props: MemberProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Member';

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get type(): MemberType {
    return this.props.type;
  }

  get company(): Company {
    return this.props.company;
  }

  get refresh_token(): string {
    return this.props.refresh_token;
  }

  static create(props: CreateMemberProps): Result<Member> {
    const validated = Member.validate({
      id: v4(),
      name: props.name,
      email: props.email,
      password: props.password,
      type: MemberType[props.type],
      company: props.company,
      refresh_token: props.refresh_token,
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Member(validated.data));
  }

  static reconstitute(props: MemberDTO): Result<Member> {
    const validated = Member.validate({
      ...props,
      id: props.id ?? v4(),
      name: props.name,
      email: props.email,
      password: props.password,
      type: MemberType[props.type],
      company: Company.reconstitute(props.company).data,
      refresh_token: props.refresh_token,
      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Member>(new Member(validated.data));
  }

  static validate(data: MemberProps): Result<MemberProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(255).required(),
      email: Joi.string().email().min(1).max(255).required(),
      password: Joi.string().min(8).max(255).required(),
      type: Joi.string()
        .valid(
          MemberType.MANAGER,
          MemberType.TECHNIQUE,
          MemberType.ATTENDANT,
        )
        .required(),
      company: Joi.object().instance(Company).required(),
      refresh_token: Joi.string().min(8).max(255).optional().allow(null),
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

  toDTO(): MemberDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      type: this.type,
      company: this.company.toDTO(),
      refresh_token: this.refresh_token,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
