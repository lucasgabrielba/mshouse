import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { CompanyDTO } from '../../DTO/CompanyDTO';
import { Address, CreateAddressPropsPrimitive, UpdateAddressPropsPrimitive } from './Address';

export interface CreateCompanyPropsPrimitive {
  name: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  whatsapp?: string;
  cnpj?: string;
  email: string;
  email2?: string;
  email3?: string;
  site?: string;
  address?: CreateAddressPropsPrimitive;
}

export interface UpdateCompanyPropsPrimitive {
  name: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  whatsapp?: string;
  cnpj?: string;
  email: string;
  email2?: string;
  email3?: string;
  site?: string;
  address?: UpdateAddressPropsPrimitive;
}

export interface CreateCompanyProps {
  name: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  whatsapp?: string;
  cnpj?: string;
  email: string;
  email2?: string;
  email3?: string;
  site?: string;
  address?: Address;
}

export interface CompanyProps extends CreateCompanyProps, AuditableProps {}

export class Company extends Auditable {
  constructor(protected props: CompanyProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Company';

  get name(): string {
    return this.props.name;
  }
  get phone(): string {
    return this.props.phone;
  }
  get phone2(): string {
    return this.props.phone2;
  }
  get phone3(): string {
    return this.props.phone3;
  }
  get whatsapp(): string {
    return this.props.whatsapp;
  }
  get cnpj(): string {
    return this.props.cnpj;
  }
  get email(): string {
    return this.props.email;
  }
  get email2(): string {
    return this.props.email2;
  }
  get email3(): string {
    return this.props.email3;
  }
  get site(): string {
    return this.props.site;
  }
  get address(): Address {
    return this.props.address;
  }

  static create(props: CreateCompanyProps): Result<Company> {
    const validated = Company.validate({
      id: v4(),
      name: props.name,
      phone: props.phone,
      phone2: props.phone2,
      phone3: props.phone3,
      whatsapp: props.whatsapp,
      cnpj: props.cnpj,
      email: props.email,
      email2: props.email2,
      email3: props.email3,
      site: props.site,
      address: props.address,
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Company(validated.data));
  }

  static reconstitute(props: CompanyDTO): Result<Company> {
    const validated = Company.validate({
      ...props,
      id: props.id ?? v4(),
      name: props.name,
      phone: props.phone,
      phone2: props.phone2 ?? undefined,
      phone3: props.phone3 ?? undefined,
      whatsapp: props.whatsapp ?? undefined,
      cnpj: props.cnpj ?? undefined,
      email: props.email,
      email2: props.email2 ?? undefined,
      email3: props.email3 ?? undefined,
      site: props.site ?? undefined,
      address: Address.reconstitute(props.address).data,
      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Company>(new Company(validated.data));
  }

  static validate(data: CompanyProps): Result<CompanyProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(255).required(),
      phone: Joi.string().min(8).max(255).required(),
      phone2: Joi.string().min(8).max(255).optional(),
      phone3: Joi.string().min(8).max(255).optional(),
      whatsapp: Joi.string().min(8).max(255).optional(),
      cnpj: Joi.string().min(8).max(255).optional(),
      email: Joi.string().max(255).required(),
      email2: Joi.string().max(255).optional(),
      email3: Joi.string().max(255).optional(),
      site: Joi.string().max(255).optional(),
      address: Joi.object().instance(Address).optional(),
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

  toDTO(): CompanyDTO {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      phone2: this.phone2,
      phone3: this.phone3,
      whatsapp: this.whatsapp,
      cnpj: this.cnpj,
      email: this.email,
      email2: this.email2,
      email3: this.email3,
      site: this.site,
      address: this.address.toDTO(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
