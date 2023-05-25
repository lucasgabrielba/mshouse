import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { EmployeeDomainService } from '../../../../src/house/domain/domainService/EmployeeDomainService';
import { EmployeeApplicationService } from '../../../../src/house/application/service/EmployeeApplicationService';
import { Employee } from '../../../../src/house/domain/entities/Employee';
import { createEmployee } from '../../../utils/employee';
import { Chance as chance } from 'chance';
import { EmployeeType } from '../../../../src/house/domain/enum/EmployeeType';
import { Result } from '../../../../kernel/Result/Result';

let service: MockProxy<EmployeeDomainService>;
let applicationService: EmployeeApplicationService;

beforeEach(() => {
  service = mock<EmployeeDomainService>();
  applicationService = new EmployeeApplicationService(service);
});

afterEach(() => {
  mockReset(service);
});

const employeeType = [
  EmployeeType.MANAGER,
  EmployeeType.ATTENDANT,
  EmployeeType.TECHNIQUE,
];

describe('create', () => {
  it('should create an employee', async () => {
    const data = {
      name: chance().name(),
      type: chance().pickone(employeeType),
    };
    service.createAndSave.mockResolvedValue(Result.ok(createEmployee()));

    const result = await applicationService.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return an error if missing data', async () => {
    const data = {
      name: '',
      type: chance().pickone(employeeType),
    };

    service.createAndSave.mockResolvedValue(Result.fail(new Error('')));

    const result = await applicationService.create(data);

    expect(result.isFailure()).toBe(true);
    expect(result.data).toBe(null);
  });
});

describe('getById', () => {
  it('should return an employee by ID', async () => {
    const employee = createEmployee();

    service.get.mockResolvedValue(Result.ok(employee));

    const result = await applicationService.getById(employee.id);

    expect(result.isSuccess()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error with invalid ID', async () => {
    service.get.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.getById(
      chance().guid({ version: 4 }),
    );

    expect(result.isFailure()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('get', () => {
  it('should return an employee by name', async () => {
    const employee = createEmployee();

    service.getOne.mockResolvedValue(Result.ok(employee));

    const result = await applicationService.get({
      where: { name: employee.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error with invalid name', async () => {
    service.getOne.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.get({
      where: { name: '' },
    });

    expect(result.isFailure()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });

  it('should return an employee by email', async () => {
    const employee = createEmployee();

    service.getOne.mockResolvedValue(Result.ok(employee));

    const result = await applicationService.get({
      where: { email: employee.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error with invalid email', async () => {
    service.getOne.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.get({
      where: { email: '' },
    });

    expect(result.isFailure()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });

  it('should return an employee by phone', async () => {
    const employee = createEmployee();

    service.getOne.mockResolvedValue(Result.ok(employee));

    const result = await applicationService.get({
      where: { phone: employee.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error with invalid phone', async () => {
    service.getOne.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.get({
      where: { phone: '' },
    });

    expect(result.isFailure()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('all', () => {
  it('should return all employees', async () => {
    const employee = createEmployee();

    service.filter.mockResolvedValue(Result.ok([employee]));

    const result = await applicationService.all();

    expect(result.isSuccess()).toBe(true);
    expect(service.filter).toHaveBeenCalled();
  });

  it('should return error with invalid phone', async () => {
    service.filter.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.all();

    expect(result.isFailure()).toBe(true);
    expect(service.filter).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('filter', () => {
  it('should return all employees by filter', async () => {
    const employee = createEmployee();

    service.filter.mockResolvedValue(Result.ok([employee]));

    const result = await applicationService.filter({
      where: { phone: '###########' },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.filter).toHaveBeenCalled();
  });

  it('should return error with invalid filter', async () => {
    service.filter.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.filter({
      where: { phone: '' },
    });

    expect(result.isFailure()).toBe(true);
    expect(service.filter).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});
