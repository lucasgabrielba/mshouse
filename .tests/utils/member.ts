import { Chance as generate } from 'chance';
import { MemberDTO } from '../../src/company/DTO/MemberDTO';
import { MemberType } from '../../src/company/domain/enum/MemberType';
import { Member } from '../../src/company/domain/entities/Member';
import { ORMMember } from '../../src/infra/database/entities/ORMMember';
import { createCompanyDTO, createCompany } from './company';
import { ORMCompany } from '../../src/infra/database/entities/ORMCompany';

export const createMemberDTO = (
  type?: 'manager' | 'attendante' | 'technique',
): Omit<MemberDTO, 'id'> => {
  let memberType: any;
  if (type === 'manager') {
    memberType = MemberType.MANAGER;
  }
  if (type === 'attendante') {
    memberType = MemberType.ATTENDANT;
  }
  if (type === 'technique') {
    memberType = MemberType.TECHNIQUE;
  }
  if (!type) {
    memberType = generate().pickone([
      MemberType.MANAGER,
      MemberType.ATTENDANT,
      MemberType.TECHNIQUE,
    ]);
  }

  const createdAt = new Date();
  createdAt.setMilliseconds(0);

  const updatedAt = new Date();
  updatedAt.setMilliseconds(0);

  const deletedAt = new Date();
  updatedAt.setMilliseconds(0);

  return {
    name: generate().name(),
    email: generate().email(),
    password: generate().hash(),
    type: memberType,
    company: {
      ...createCompanyDTO(),
      id: generate().guid({ version: 4 }),
    },
    refresh_token: generate().hash(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    deletedAt: deletedAt.toISOString(),
  };
};

export const createMember = (
  type?: 'manager' | 'attendante' | 'technique',
  data?: Omit<MemberDTO, 'id'>,
  id?: string,
): Member => {
  if (data && id) {
    const MemberData = {
      ...data,
      id,
    };

    return Member.reconstitute(MemberData).data;
  }
  data = data ?? createMemberDTO(type ?? null);

  const company = createCompany(data.company);
  const createData = {
    ...data,
    company: company,
  };

  return Member.create(createData).data;
};

export const createORMMember = (
  Member?: Member,
  type?: 'manager' | 'attendante' | 'technique',
): ORMMember => {
  let memberType: any;
  if (type === 'manager') {
    memberType = MemberType.MANAGER;
  }
  if (type === 'attendante') {
    memberType = MemberType.ATTENDANT;
  }
  if (type === 'technique') {
    memberType = MemberType.TECHNIQUE;
  }

  const entity = new ORMMember();

  if (Member) {
    entity.id = Member.id.toString();

    entity.name = Member.name;
    entity.email = Member.email;
    entity.type = Member.type;
    entity.company = ORMCompany.import(Member.company);

    entity.createdAt = Member.createdAt;

    return entity;
  }

  const company = createCompany();

  entity.id = generate().guid({ version: 4 });

  entity.name = generate().name();
  entity.email = generate().email();
  entity.type = memberType;
  entity.company = ORMCompany.import(company);

  entity.createdAt = entity.createdAt = new Date();
  entity.updatedAt = new Date();
  entity.deletedAt = null;

  return entity;
};
