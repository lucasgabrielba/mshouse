import { Entity, Column, ManyToOne } from 'typeorm';
import { ORMBase } from './utils/ORMBase';
import { User } from '../../../company/domain/entities/User';
import { UserDTO } from '../../../company/DTO/UserDTO';
import { Injectable } from '@nestjs/common';
import { UserType } from '../../../company/domain/enum/UserType';
import { ORMCompany } from './ORMCompany';
import { Exclude } from 'class-transformer';

@Injectable()
@Entity('User')
export class ORMUser extends ORMBase {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  type: string;

  @ManyToOne(() => ORMCompany, (company) => company.users)
  company: ORMCompany;
  @Column()
  companyId: string;

  @Column({ nullable: true })
  @Exclude()
  refresh_token: string;



  static import(instance: User): ORMUser {
    const entity = new ORMUser();
    entity.id = instance.id;

    entity.name = instance.name;
    entity.email = instance.email;
    entity.password = instance.password;
    entity.type = instance.type;
    entity.company = ORMCompany.import(instance.company);
    entity.refresh_token = instance.refresh_token;
    entity.createdAt = instance.createdAt;
    entity.updatedAt = instance.updatedAt;
    entity.deletedAt = instance.deletedAt;

    return entity;
  }

  export(): User {
    const dto: UserDTO = {
      id: this.id,

      name: this.name,
      email: this.email,
      password: this.password,
      type: UserType[this.type],
      company: this.company.export().toDTO(),
      refresh_token: this.refresh_token ?? undefined,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return User.reconstitute(dto).data;
  }
}
