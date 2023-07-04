import { Entity, Column, ManyToOne } from 'typeorm';
import { ORMBase } from './utils/ORMBase';
import { Member } from '../../../company/domain/entities/Member';
import { MemberDTO } from '../../../company/DTO/MemberDTO';
import { Injectable } from '@nestjs/common';
import { MemberType } from '../../../company/domain/enum/MemberType';
import { ORMCompany } from './ORMCompany';
import { Exclude } from 'class-transformer';

@Injectable()
@Entity('Member')
export class ORMMember extends ORMBase {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  type: string;

  @ManyToOne(() => ORMCompany, (company) => company.members)
  company: ORMCompany;
  @Column()
  companyId: string;

  @Column({ nullable: true })
  @Exclude()
  refresh_token: string;


  static import(instance: Member): ORMMember {
    const entity = new ORMMember();

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

  export(): Member {
    const dto: MemberDTO = {
      id: this.id,

      name: this.name,
      email: this.email,
      password: this.password,
      type: MemberType[this.type],
      company: this.company.export().toDTO(),
      refresh_token: this.refresh_token ?? undefined,

      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt ? this.updatedAt.toISOString() : null,
      deletedAt: this.deletedAt ? this.deletedAt.toISOString() : null,
    };

    return Member.reconstitute(dto).data;
  }
}
