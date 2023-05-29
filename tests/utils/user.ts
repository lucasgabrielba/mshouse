import { Chance as chance } from 'chance';
import { UserDTO } from '../../src/company/DTO/UserDTO';
import { UserType } from '../../src/company/domain/enum/UserType';
import { User } from '../../src/company/domain/entities/User';
import { ORMUser } from '../../src/infra/database/entities/ORMUser';
import { createCompanyDTO, createCompany } from './company';
import { ORMCompany } from '../../src/infra/database/entities/ORMCompany';

export const createUserDTO = (
  type?: 'manager' | 'attendante' | 'technique',
): Omit<UserDTO, 'id'> => {
  let userType: any;
  if (type === 'manager') {
    userType = UserType.MANAGER;
  }
  if (type === 'attendante') {
    userType = UserType.ATTENDANT;
  }
  if (type === 'technique') {
    userType = UserType.TECHNIQUE;
  }
  if (!type) {
    userType = chance().pickone([
      UserType.MANAGER,
      UserType.ATTENDANT,
      UserType.TECHNIQUE,
    ]);
  }

  const createdAt = new Date();
  createdAt.setMilliseconds(0);

  const updatedAt = new Date();
  updatedAt.setMilliseconds(0);

  const deletedAt = new Date();
  updatedAt.setMilliseconds(0);

  return {
    name: chance().name(),
    email: chance().email(),
    type: userType,
    company: {
      ...createCompanyDTO(),
      id: chance().guid({ version: 4 }),
    },
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    deletedAt: deletedAt.toISOString(),
  };
};

export const createUser = (
  type?: 'manager' | 'attendante' | 'technique',
  data?: Omit<UserDTO, 'id'>,
  id?: string,
): User => {
  if (data && id) {
    const UserData = {
      ...data,
      id,
    };

    return User.reconstitute(UserData).data;
  }
  data = data ?? createUserDTO(type ?? null);

  const company = createCompany(data.company);
  const createData = {
    ...data,
    company: company,
  };

  return User.create(createData).data;
};

export const createORMUser = (
  User?: User,
  type?: 'manager' | 'attendante' | 'technique',
): ORMUser => {
  let userType: any;
  if (type === 'manager') {
    userType = UserType.MANAGER;
  }
  if (type === 'attendante') {
    userType = UserType.ATTENDANT;
  }
  if (type === 'technique') {
    userType = UserType.TECHNIQUE;
  }

  const entity = new ORMUser();

  if (User) {
    entity.id = User.id.toString();

    entity.name = User.name;
    entity.email = User.email;
    entity.type = User.type;
    entity.company = ORMCompany.import(User.company);

    entity.createdAt = User.createdAt;

    return entity;
  }

  const company = createCompany();

  entity.id = chance().guid({ version: 4 });

  entity.name = chance().name();
  entity.email = chance().email();
  entity.type = userType;
  entity.company = ORMCompany.import(company);

  entity.createdAt = entity.createdAt = new Date();
  entity.updatedAt = new Date();
  entity.deletedAt = null;

  return entity;
};
