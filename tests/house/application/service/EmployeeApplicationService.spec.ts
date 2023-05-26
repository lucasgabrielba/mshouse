import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { EmployeeDomainService } from '../../../../src/house/domain/domainService/EmployeeDomainService';
import { EmployeeApplicationService } from '../../../../src/house/application/service/EmployeeApplicationService';
import { Employee } from '../../../../src/house/domain/entities/Employee';
import { createEmployee } from '../../../utils/employee';
import { Chance as chance } from 'chance';
import { EmployeeType } from '../../../../src/house/domain/enum/EmployeeType';
import { Result } from '../../../../kernel/Result/Result';
import { HouseApplicationService } from '../../../../src/house/application/service/HouseApplicationService';
import { createHouse } from '../../../utils/house';

let service: MockProxy<EmployeeDomainService>;
let applicationService: EmployeeApplicationService;

let houseApplicationService: MockProxy<HouseApplicationService>;

beforeEach(() => {
  houseApplicationService = mock<HouseApplicationService>()

  service = mock<EmployeeDomainService>();
  applicationService = new EmployeeApplicationService(service, houseApplicationService);
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
    const employee = createEmployee()
    const house = createHouse()

    const data = {
      name: chance().name(),
      type: chance().pickone(employeeType),
      email: chance().email(),
      houseId: house.id
    };

    service.getOne.mockResolvedValue(Result.fail(new Error('')));
    houseApplicationService.getById.mockResolvedValue(Result.ok(house))
    service.createAndSave.mockResolvedValue(Result.ok(employee));

    const result = await applicationService.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return an error if missing data', async () => {
    const employee = createEmployee()
    const house = createHouse()

    const data = {
      name: '',
      type: chance().pickone(employeeType),
      email: chance().email(),
      houseId: house.id,
    };

    service.getOne.mockResolvedValue(Result.ok(employee));
    houseApplicationService.getById.mockResolvedValue(Result.ok(house))
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

    service.find.mockResolvedValue(Result.ok([employee]));

    const result = await applicationService.all();

    expect(result.isSuccess()).toBe(true);
    expect(service.find).toHaveBeenCalled();
  });

  it('should return error with invalid phone', async () => {
    service.find.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.all();

    expect(result.isFailure()).toBe(true);
    expect(service.find).toHaveBeenCalled();
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
