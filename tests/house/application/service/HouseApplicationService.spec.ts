import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { HouseDomainService } from '../../../../src/house/domain/domainService/HouseDomainService';
import { HouseApplicationService } from '../../../../src/house/application/service/HouseApplicationService';
import { House } from '../../../../src/house/domain/entities/House';
import { createHouse } from '../../../utils/house';
import { Chance as chance } from 'chance';
import { Result } from '../../../../kernel/Result/Result';

let service: MockProxy<HouseDomainService>;
let applicationService: HouseApplicationService;

beforeEach(() => {
  service = mock<HouseDomainService>();
  applicationService = new HouseApplicationService(service);
});

afterEach(() => {
  mockReset(service);
});

describe('create', () => {
  it('should create an House', async () => {
    const data = {
      name: chance().name(),
      email: chance().email(),
      phone: chance().phone(),
      address: chance().address(),
    };

    service.getOne.mockResolvedValue(Result.fail(new Error('')))
    service.createAndSave.mockResolvedValue(Result.ok(createHouse()));

    const result = await applicationService.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(House);
  });

  it('should return an error if missing data', async () => {
    const data = {
      name: '',
      email: chance().email(),
      phone: chance().phone(),
      address: chance().address(),
    };

    service.getOne.mockResolvedValue(Result.ok(createHouse()))
    service.createAndSave.mockResolvedValue(Result.fail(new Error('')));

    const result = await applicationService.create(data);

    expect(result.isFailure()).toBe(true);
    expect(result.data).toBe(null);
  });
});

describe('getById', () => {
  it('should return an House by ID', async () => {
    const house = createHouse();

    service.get.mockResolvedValue(Result.ok(house));

    const result = await applicationService.getById(house.id);

    expect(result.isSuccess()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(House);
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
  it('should return an House by name', async () => {
    const house = createHouse();

    service.getOne.mockResolvedValue(Result.ok(house));

    const result = await applicationService.get({
      where: { name: house.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(House);
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

  it('should return an House by email', async () => {
    const house = createHouse();

    service.getOne.mockResolvedValue(Result.ok(house));

    const result = await applicationService.get({
      where: { email: house.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(House);
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

  it('should return an House by phone', async () => {
    const house = createHouse();

    service.getOne.mockResolvedValue(Result.ok(house));

    const result = await applicationService.get({
      where: { phone: House.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(House);
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
  it('should return all Houses', async () => {
    const House = createHouse();

    service.find.mockResolvedValue(Result.ok([House]));

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
  it('should return all Houses by filter', async () => {
    const House = createHouse();

    service.filter.mockResolvedValue(Result.ok([House]));

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
