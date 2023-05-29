import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { CompanyDomainService } from '../../../../src/company/domain/domainService/CompanyDomainService';
import { CompanyApplicationService } from '../../../../src/company/application/service/CompanyApplicationService';
import { Company } from '../../../../src/company/domain/entities/Company';
import { createCompany } from '../../../utils/company';
import { Chance as chance } from 'chance';
import { Result } from '../../../../kernel/Result/Result';

let service: MockProxy<CompanyDomainService>;
let applicationService: CompanyApplicationService;

beforeEach(() => {
  service = mock<CompanyDomainService>();
  applicationService = new CompanyApplicationService(service);
});

afterEach(() => {
  mockReset(service);
});

describe('create', () => {
  it('should create an Company', async () => {
    const data = {
      name: chance().name(),
      email: chance().email(),
      phone: chance().phone(),
      address: chance().address(),
    };

    service.getOne.mockResolvedValue(Result.fail(new Error('')))
    service.createAndSave.mockResolvedValue(Result.ok(createCompany()));

    const result = await applicationService.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Company);
  });

  it('should return an error if missing data', async () => {
    const data = {
      name: '',
      email: chance().email(),
      phone: chance().phone(),
      address: chance().address(),
    };

    service.getOne.mockResolvedValue(Result.ok(createCompany()))
    service.createAndSave.mockResolvedValue(Result.fail(new Error('')));

    const result = await applicationService.create(data);

    expect(result.isFailure()).toBe(true);
    expect(result.data).toBe(null);
  });
});

describe('getById', () => {
  it('should return an Company by ID', async () => {
    const company = createCompany();

    service.get.mockResolvedValue(Result.ok(company));

    const result = await applicationService.getById(company.id);

    expect(result.isSuccess()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Company);
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
  it('should return an Company by name', async () => {
    const company = createCompany();

    service.getOne.mockResolvedValue(Result.ok(company));

    const result = await applicationService.get({
      where: { name: company.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Company);
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

  it('should return an Company by email', async () => {
    const company = createCompany();

    service.getOne.mockResolvedValue(Result.ok(company));

    const result = await applicationService.get({
      where: { email: company.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Company);
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

  it('should return an Company by phone', async () => {
    const company = createCompany();

    service.getOne.mockResolvedValue(Result.ok(company));

    const result = await applicationService.get({
      where: { phone: Company.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Company);
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
  it('should return all Companys', async () => {
    const Company = createCompany();

    service.find.mockResolvedValue(Result.ok([Company]));

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
  it('should return all Companys by filter', async () => {
    const Company = createCompany();

    service.filter.mockResolvedValue(Result.ok([Company]));

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
