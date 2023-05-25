import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { EmployeeRepositoryInterface } from '../../../../src/house/domain/repository/EmployeeRepositoryInterface';
import { EmployeeDomainService } from '../../../../src/house/domain/domainService/EmployeeDomainService';
import { EmployeeType } from '../../../../src/house/domain/enum/EmployeeType';
import { Employee } from '../../../../src/house/domain/entities/Employee';
import { Chance as chance } from 'chance';
import { createEmployeeDTO } from '../../../utils/employee';

let repository: MockProxy<EmployeeRepositoryInterface>;

beforeEach(() => {
  repository = mock<EmployeeRepositoryInterface>();
});

afterEach(() => {
  mockClear(repository);
});

describe('Create Employee', () => {
  it('Should create Employee', async () => {
    const data = {
      name: 'test',
      type: EmployeeType.MANAGER,
    };

    const service = new EmployeeDomainService(repository);
    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Employee);
  });

  describe('Build Employee', () => {
    it('Should build a Employee', async () => {
      const dto = {
        ...createEmployeeDTO('manager'),
        id: chance().guid({ version: 4 }),
      };

      const service = new EmployeeDomainService(repository);
      const result = await service.build(dto);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Employee);
    });
  });
});
