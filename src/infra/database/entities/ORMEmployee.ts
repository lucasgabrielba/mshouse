import { Entity, Column, ManyToOne } from 'typeorm';
import { ORMBase } from './utils/ORMBase';
import { Employee } from '../../../house/domain/entities/Employee';
import { EmployeeDTO } from '../../../house/DTO/EmployeeDTO';
import { Injectable } from '@nestjs/common';
import { EmployeeType } from '../../../house/domain/enum/EmployeeType';
import { ORMHouse } from './ORMHouse';

@Injectable()
@Entity('Employee')
export class ORMEmployee extends ORMBase {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  type: string;

  @ManyToOne(() => ORMHouse, (house) => house.employees)
  house: ORMHouse;
  @Column()
  houseId: string;

  static import(instance: Employee): ORMEmployee {
    const entity = new ORMEmployee();
    entity.id = instance.id;

    entity.name = instance.name;
    entity.email = instance.email;
    entity.type = instance.type;
    entity.house = ORMHouse.import(instance.house);

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Employee {
    const dto: EmployeeDTO = {
      id: this.id,

      name: this.name,
      email: this.email,
      type: EmployeeType[this.type],
      house: this.house.export().toDTO(),

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Employee.reconstitute(dto).data;
  }
}
