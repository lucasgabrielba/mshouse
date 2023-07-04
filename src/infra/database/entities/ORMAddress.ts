import { Entity, Column, OneToOne } from 'typeorm';
import { ORMBase } from './utils/ORMBase';
import { Injectable } from '@nestjs/common';
import { ORMCompany } from './ORMCompany';
import { Address } from '../../../company/domain/entities/Address';
import { AddressDTO } from '../../../company/DTO/AddressDTO';

@Injectable()
@Entity('Address')
export class ORMAddress extends ORMBase {
  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  complement?: string;

  @Column({ nullable: true })
  number?: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  cep?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state: string;

  @OneToOne(() => ORMCompany, (company) => company.address)
  company: ORMCompany;

  static import(instance: Address): ORMAddress {
    const entity = new ORMAddress();
    entity.id = instance.id;

    entity.address = instance.address;
    entity.complement = instance.complement;
    entity.number = instance.number;
    entity.district = instance.district;
    entity.cep = instance.cep;
    entity.city = instance.city;
    entity.state = instance.state;

    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): Address {
    const dto: AddressDTO = {
      id: this.id,

      address: this.address,
      complement: this.complement,
      number: this.number,
      district: this.district,
      cep: this.cep,
      city: this.city,
      state: this.state,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Address.reconstitute(dto).data;
  }
}
