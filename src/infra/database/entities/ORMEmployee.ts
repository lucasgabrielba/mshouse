import { Entity, Column } from 'typeorm';
import { ORMBase } from './utils/ORMBase';
import { Employee } from '../../../house/domain/entities/Employee';
import { EmployeeDTO } from '../../../house/DTO/EmployeeDTO';
import { Injectable } from '@nestjs/common';
import { EmployeeType } from '../../../house/domain/enum/EmployeeType';

@Injectable()
@Entity('Employee')
export class ORMEmployee extends ORMBase {
  @Column()
  name: string;

  @Column()
  type: string;

  static import(instance: Employee): ORMEmployee {
    const entity = new ORMEmployee();
    entity.id = instance.id;

    entity.name = instance.name;
    entity.type = instance.type;

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Employee {
    const dto: EmployeeDTO = {
      id: this.id,

      name: this.name,
      type: EmployeeType[this.type],

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Employee.reconstitute(dto).data;
  }
}
