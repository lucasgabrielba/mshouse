import { EmployeeEntrypoint } from '../../../src/web/house/entrypoint/employee.entrypoint';
import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { EmployeeApplicationService } from '../../../src/house/application/service/EmployeeApplicationService';
import { createEmployee } from '../../utils/employee';
import { Result } from '../../../kernel/Result/Result';
import { Employee } from '../../../src/house/domain/entities/Employee';
import { EmployeeService } from '../../../src/web/house/employee/employee.service';
import { Chance as chance } from 'chance';
import { EmployeeType } from '../../../src/house/domain/enum/EmployeeType';

let service: EmployeeService;
let employeeEntrypoint: MockProxy<EmployeeEntrypoint>;
let applicationService: MockProxy<EmployeeApplicationService>;

beforeEach(() => {
  employeeEntrypoint = mock<EmployeeEntrypoint>();
  applicationService = mock<EmployeeApplicationService>();

  employeeEntrypoint.getApplicationService.mockReturnValue(applicationService);

  service = new EmployeeService(employeeEntrypoint);
});

afterEach(() => {
  mockReset(employeeEntrypoint);
  mockReset(applicationService);
});

describe('listAllEmployee', () => {
  it('should list all employees', async () => {
    const employeeArray = [createEmployee(), createEmployee()];

    applicationService.all.mockResolvedValue(Result.ok(employeeArray));

    const result = await service.listAllEmployee();

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should return error', async () => {
    applicationService.all.mockResolvedValue(Result.fail(new Error('error')));

    const result = await service.listAllEmployee();

    expect(result.isFailure()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('findOne', () => {
  it('should return employee by ID', async () => {
    const employee = createEmployee();

    applicationService.getById.mockResolvedValue(Result.ok(employee));

    const result = await service.findOne(employee.id);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error with invalid ID', async () => {
    applicationService.getById.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.findOne(chance().guid({ version: 4 }));

    expect(result.isFailure()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('create', () => {
  it('should create a employee', async () => {
    const employee = createEmployee();

    const data = {
      name: employee.name,
      type: employee.type,
      email: employee.email,
      houseId: employee.house.id,
    };

    applicationService.create.mockResolvedValue(Result.ok(employee));

    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.create).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error invalid data', async () => {
    const data = {
      name: '',
      type: EmployeeType.ATTENDANT,
      email: '',
      houseId: ''
    };

    applicationService.create.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.create(data);

    expect(result.isFailure()).toBe(true);
    expect(applicationService.create).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('update', () => {
  it('should update a employee', async () => {
    const employee = createEmployee();

    const data = {
      name: chance().name(),
      type: employee.type,
    };

    applicationService.updateEntity.mockResolvedValue(Result.ok(employee));

    const result = await service.update(employee.id, data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Employee);
  });

  it('should return error invalid id', async () => {
    const data = {
      name: chance().name(),
      type: EmployeeType.ATTENDANT,
    };

    applicationService.updateEntity.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.update(chance().guid({ version: 4 }), data);

    expect(result.isFailure()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('delete', () => {
  it('should delete a employee', async () => {
    const employee = createEmployee();

    applicationService.remove.mockResolvedValue(Result.ok(true));

    const result = await service.delete(employee.id);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.remove).toHaveBeenCalled();
    expect(result.data).toBe(true);
  });

  it('should return error invalid id', async () => {
    applicationService.remove.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.delete(chance().guid({ version: 4 }));

    expect(result.isFailure()).toBe(true);
    expect(applicationService.remove).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});
