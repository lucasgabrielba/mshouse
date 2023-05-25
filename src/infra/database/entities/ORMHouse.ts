import { Column, Entity, OneToMany } from 'typeorm';
import { ORMBase } from './utils/ORMBase';
import { Injectable } from '@nestjs/common';
import { House } from '../../../house/domain/entities/House';
import { HouseDTO } from '../../../house/DTO/HouseDTO';
import { ORMEmployee } from './ORMEmployee';

@Injectable()
@Entity('House')
export class ORMHouse extends ORMBase {
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  phone2?: string;

  @Column({ nullable: true })
  phone3?: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  email2?: string;

  @Column({ nullable: true })
  email3?: string;

  @Column({ nullable: true })
  site?: string;

  @Column()
  address: string;

  @OneToMany(() => ORMEmployee, (employee) => employee.house, {
    onDelete: 'CASCADE',
  })
  employees?: ORMEmployee[];

  static import(instance: House): ORMHouse {
    const entity = new ORMHouse();
    entity.id = instance.id;

    entity.name = instance.name;
    entity.phone = instance.phone;
    entity.phone2 = instance.phone2;
    entity.phone3 = instance.phone3;
    entity.email = instance.email;
    entity.email2 = instance.email2;
    entity.email3 = instance.email3;
    entity.site = instance.site;
    entity.address = instance.address;

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): House {
    const dto: HouseDTO = {
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
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return House.reconstitute(dto).data;
  }
}
