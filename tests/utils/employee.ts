import { Chance as chance } from 'chance';
import { EmployeeDTO } from '../../src/house/DTO/EmployeeDTO';
import { EmployeeType } from '../../src/house/domain/enum/EmployeeType';
import { Employee } from '../../src/house/domain/entities/Employee';
import { ORMEmployee } from '../../src/infra/database/entities/ORMEmployee';
import { createHouseDTO, createHouse } from './house';
import { ORMHouse } from '../../src/infra/database/entities/ORMHouse';

export const createEmployeeDTO = (
  type?: 'manager' | 'attendante' | 'technique',
): Omit<EmployeeDTO, 'id'> => {
  let employeeType: any;
  if (type === 'manager') {
    employeeType = EmployeeType.MANAGER;
  }
  if (type === 'attendante') {
    employeeType = EmployeeType.ATTENDANT;
  }
  if (type === 'technique') {
    employeeType = EmployeeType.TECHNIQUE;
  }
  if (!type) {
    employeeType = chance().pickone([
      EmployeeType.MANAGER,
      EmployeeType.ATTENDANT,
      EmployeeType.TECHNIQUE,
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
    type: employeeType,
    house: {
      ...createHouseDTO(),
      id: chance().guid({ version: 4 }),
    },
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    deletedAt: deletedAt.toISOString(),
  };
};

export const createEmployee = (
  type?: 'manager' | 'attendante' | 'technique',
  data?: Omit<EmployeeDTO, 'id'>,
  id?: string,
): Employee => {
  if (data && id) {
    const EmployeeData = {
      ...data,
      id,
    };

    return Employee.reconstitute(EmployeeData).data;
  }
  data = data ?? createEmployeeDTO(type ?? null);

  const house = createHouse(data.house);
  const createData = {
    ...data,
    house: house,
  };

  return Employee.create(createData).data;
};

export const createORMEmployee = (
  Employee?: Employee,
  type?: 'manager' | 'attendante' | 'technique',
): ORMEmployee => {
  let employeeType: any;
  if (type === 'manager') {
    employeeType = EmployeeType.MANAGER;
  }
  if (type === 'attendante') {
    employeeType = EmployeeType.ATTENDANT;
  }
  if (type === 'technique') {
    employeeType = EmployeeType.TECHNIQUE;
  }

  const entity = new ORMEmployee();

  if (Employee) {
    entity.id = Employee.id.toString();

    entity.name = Employee.name;
    entity.email = Employee.email;
    entity.type = Employee.type;
    entity.house = ORMHouse.import(Employee.house);

    entity.createdAt = Employee.createdAt;

    return entity;
  }

  const house = createHouse();

  entity.id = chance().guid({ version: 4 });

  entity.name = chance().name();
  entity.email = chance().email();
  entity.type = employeeType;
  entity.house = ORMHouse.import(house);

  entity.createdAt = entity.createdAt = new Date();
  entity.updatedAt = new Date();
  entity.deletedAt = null;

  return entity;
};
