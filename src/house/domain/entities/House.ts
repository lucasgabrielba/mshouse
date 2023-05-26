import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable';
import { HouseDTO } from '../../DTO/HouseDTO';

export interface CreateHousePropsPrimitive {
  name: string;
  phone: string;
  phone2?: string;
  phone3?: string;
  email: string;
  email2?: string;
  email3?: string;
  site?: string;
  address?: string;
}

export interface UpdateHousePropsPrimitive
  extends Partial<CreateHousePropsPrimitive> {}

export interface CreateHouseProps extends CreateHousePropsPrimitive {}

export interface HouseProps extends CreateHouseProps, AuditableProps {}

export class House extends Auditable {
  constructor(protected props: HouseProps) {
    super(props);
  }

  public static readonly LABEL: string = 'House';

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
  get address(): string {
    return this.props.address;
  }

  static create(props: CreateHouseProps): Result<House> {
    const validated = House.validate({
      id: v4(),
      name: props.name,
      phone: props.phone,
      phone2: props.phone2,
      phone3: props.phone3,
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

    return Result.ok(new House(validated.data));
  }

  static reconstitute(props: HouseDTO): Result<House> {
    const validated = House.validate({
      ...props,
      id: props.id ?? v4(),
      name: props.name,
      phone: props.phone,
      phone2: props.phone2 ?? undefined,
      phone3: props.phone3 ?? undefined,
      email: props.email,
      email2: props.email2 ?? undefined,
      email3: props.email3 ?? undefined,
      site: props.site ?? undefined,
      address: props.address,
      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<House>(new House(validated.data));
  }

  static validate(data: HouseProps): Result<HouseProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(255).required(),
      phone: Joi.string().min(8).max(255).required(),
      phone2: Joi.string().min(8).max(255).optional(),
      phone3: Joi.string().min(8).max(255).optional(),
      email: Joi.string().max(255).required(),
      email2: Joi.string().max(255).optional(),
      email3: Joi.string().max(255).optional(),
      site: Joi.string().max(255).optional(),
      address: Joi.string().max(255).optional(),
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

  toDTO(): HouseDTO {
    return {
      id: this.id,
      name: this.name,
      phone: this.phone,
      phone2: this.phone2,
      phone3: this.phone3,
      email: this.email,
      email2: this.email2,
      email3: this.email3,
      site: this.site,
      address: this.address,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
