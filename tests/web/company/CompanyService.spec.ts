import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { CompanyApplicationService } from '../../../src/company/application/service/CompanyApplicationService';
import { Result } from '../../../kernel/Result/Result';
import { Company } from '../../../src/company/domain/entities/Company';
import { Chance as chance } from 'chance';
import { CompanyService } from '../../../src/web/company/company/company.service';
import { createCompany } from '../../utils/company';
import { CompanyEntrypoint } from '../../../src/web/company/entrypoint/company.entrypoint';

let service: CompanyService;
let companyEntrypoint: MockProxy<CompanyEntrypoint>;
let applicationService: MockProxy<CompanyApplicationService>;

beforeEach(() => {
  companyEntrypoint = mock<CompanyEntrypoint>();
  applicationService = mock<CompanyApplicationService>();

  companyEntrypoint.getApplicationService.mockReturnValue(applicationService);

  service = new CompanyService(companyEntrypoint);
});

afterEach(() => {
  mockReset(companyEntrypoint);
  mockReset(applicationService);
});

describe('listAllCompany', () => {
  it('should list all Companys', async () => {
    const CompanyArray = [createCompany(), createCompany()];

    applicationService.all.mockResolvedValue(Result.ok(CompanyArray));

    const result = await service.listAllCompany();

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should return error', async () => {
    applicationService.all.mockResolvedValue(Result.fail(new Error('error')));

    const result = await service.listAllCompany();

    expect(result.isFailure()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('findOne', () => {
  it('should return Company by ID', async () => {
    const Company = createCompany();

    applicationService.getById.mockResolvedValue(Result.ok(Company));

    const result = await service.findOne(Company.id);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
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
  it('should create a Company', async () => {
    const company = createCompany();

    const data = {
      name: company.name,
      phone: company.phone,
      email: company.email,
      address: company.address,
    };

    applicationService.create.mockResolvedValue(Result.ok(company));

    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.create).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Company);
  });

  it('should return error invalid data', async () => {
    const data = {
      name: '',
      phone: '',
      email: '',
      address: '',
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
  it('should update a Company', async () => {
    const company = createCompany();

    const data = {
      name: chance().name(),
      phone: chance().phone(),
      email: company.email,
      address: company.address,
    };

    applicationService.updateEntity.mockResolvedValue(Result.ok(company));

    const result = await service.update(company.id, data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Company);
  });

  it('should return error invalid id', async () => {
    const data = {
      name: chance().name(),
      phone: chance().phone(),
      email: chance().email(),
      address: chance().address(),
    };

    applicationService.updateEntity.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.update(chance().guid({ version: 4 }), data);

    expect(result.isFailure()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });

  describe('delete', () => {
    it('should delete a Company', async () => {
      const company = createCompany();

      applicationService.remove.mockResolvedValue(Result.ok(true));

      const result = await service.delete(company.id);

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
});