import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { CompanyRepositoryInterface } from '../../../../src/company/domain/repository/CompanyRepositoryInterface';
import { CompanyDomainService } from '../../../../src/company/domain/domainService/CompanyDomainService';
import { Company } from '../../../../src/company/domain/entities/Company';
import { Chance as chance } from 'chance';
import { createCompanyDTO } from '../../../utils/company';

let repository: MockProxy<CompanyRepositoryInterface>;

beforeEach(() => {
  repository = mock<CompanyRepositoryInterface>();
});

afterEach(() => {
  mockClear(repository);
});

describe('Create Company', () => {
  it('Should create Company', async () => {
    const data = createCompanyDTO();

    const service = new CompanyDomainService(repository);
    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Company);
  });

  describe('Build Company', () => {
    it('Should build a Company', async () => {
      const dto = { ...createCompanyDTO(), id: chance().guid({ version: 4 }) };

      const service = new CompanyDomainService(repository);
      const result = await service.build(dto);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Company);
    });
  });
});
