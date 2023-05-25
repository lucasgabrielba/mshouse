import { v4 } from 'uuid';
import * as Joi from 'joi';
import { Result } from '../../../../kernel/Result/Result.js';
import { EmployeeDTO } from '../../DTO/EmployeeDTO.js';
import {
  Auditable,
  AuditableProps,
} from '../../../../kernel/domain/entity/Auditable.js';
import { EmployeeType } from '../enum/EmployeeType.js';

export interface CreateEmployeePropsPrimitive {
  name: string;
  type: EmployeeType;
}

export interface UpdateEmployeePropsPrimitive
  extends Partial<CreateEmployeePropsPrimitive> {}

export interface CreateEmployeeProps extends CreateEmployeePropsPrimitive {}

export interface EmployeeProps extends CreateEmployeeProps, AuditableProps {}

export class Employee extends Auditable {
  constructor(protected props: EmployeeProps) {
    super(props);
  }

  public static readonly LABEL: string = 'Employee';

  get name(): string {
    return this.props.name;
  }

  get type(): EmployeeType {
    return this.props.type;
  }

  static create(props: CreateEmployeeProps): Result<Employee> {
    const validated = Employee.validate({
      id: v4(),
      name: props.name,
      type: EmployeeType[props.type],
      createdAt: new Date(),
      updatedAt: undefined,
      deletedAt: undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok(new Employee(validated.data));
  }

  static reconstitute(props: EmployeeDTO): Result<Employee> {
    const validated = Employee.validate({
      ...props,
      id: props.id ?? v4(),
      type: EmployeeType[props.type],
      createdAt: props.createdAt ? new Date(props.createdAt) : undefined,
      updatedAt: props.updatedAt ? new Date(props.updatedAt) : undefined,
      deletedAt: props.deletedAt ? new Date(props.deletedAt) : undefined,
    });

    if (validated.isFailure()) {
      return Result.fail(validated.error);
    }

    return Result.ok<Employee>(new Employee(validated.data));
  }

  static validate(data: EmployeeProps): Result<EmployeeProps> {
    const schema = {
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).max(255).required(),
      type: Joi.string()
        .valid(
          EmployeeType.MANAGER,
          EmployeeType.TECHNIQUE,
          EmployeeType.ATTENDANT,
        )
        .required(),
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

  toDTO(): EmployeeDTO {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.props.deletedAt
        ? this.props.deletedAt.toISOString()
        : null,
    };
  }
}
