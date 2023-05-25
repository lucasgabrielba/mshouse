import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { HouseRepositoryInterface } from '../../../../src/house/domain/repository/HouseRepositoryInterface';
import { HouseDomainService } from '../../../../src/house/domain/domainService/HouseDomainService';
import { House } from '../../../../src/house/domain/entities/House';
import { Chance as chance } from 'chance';
import { createHouseDTO } from '../../../utils/house';

let repository: MockProxy<HouseRepositoryInterface>;

beforeEach(() => {
  repository = mock<HouseRepositoryInterface>();
});

afterEach(() => {
  mockClear(repository);
});

describe('Create House', () => {
  it('Should create House', async () => {
    const data = createHouseDTO();

    const service = new HouseDomainService(repository);
    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(House);
  });

  describe('Build House', () => {
    it('Should build a House', async () => {
      const dto = { ...createHouseDTO(), id: chance().guid({ version: 4 }) };

      const service = new HouseDomainService(repository);
      const result = await service.build(dto);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(House);
    });
  });
});
