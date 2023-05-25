import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { HouseApplicationService } from '../../../src/house/application/service/HouseApplicationService';
import { Result } from '../../../kernel/Result/Result';
import { House } from '../../../src/house/domain/entities/House';
import { Chance as chance } from 'chance';
import { HouseService } from '../../../src/web/house/house/house.service';
import { createHouse } from '../../utils/house';
import { HouseEntrypoint } from '../../../src/web/house/entrypoint/house.entrypoint';

let service: HouseService;
let houseEntrypoint: MockProxy<HouseEntrypoint>;
let applicationService: MockProxy<HouseApplicationService>;

beforeEach(() => {
  houseEntrypoint = mock<HouseEntrypoint>();
  applicationService = mock<HouseApplicationService>();

  houseEntrypoint.getApplicationService.mockReturnValue(applicationService);

  service = new HouseService(houseEntrypoint);
});

afterEach(() => {
  mockReset(houseEntrypoint);
  mockReset(applicationService);
});

describe('listAllHouse', () => {
  it('should list all Houses', async () => {
    const HouseArray = [createHouse(), createHouse()];

    applicationService.all.mockResolvedValue(Result.ok(HouseArray));

    const result = await service.listAllHouse();

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should return error', async () => {
    applicationService.all.mockResolvedValue(Result.fail(new Error('error')));

    const result = await service.listAllHouse();

    expect(result.isFailure()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('findOne', () => {
  it('should return House by ID', async () => {
    const House = createHouse();

    applicationService.getById.mockResolvedValue(Result.ok(House));

    const result = await service.findOne(House.id);

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
  it('should create a House', async () => {
    const house = createHouse();

    const data = {
      name: house.name,
      phone: house.phone,
      email: house.email,
      address: house.address,
    };

    applicationService.create.mockResolvedValue(Result.ok(house));

    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.create).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(House);
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
  it('should update a House', async () => {
    const house = createHouse();

    const data = {
      name: chance().name(),
      phone: chance().phone(),
      email: house.email,
      address: house.address,
    };

    applicationService.getById.mockResolvedValue(Result.ok(house));
    applicationService.update.mockResolvedValue(Result.ok(house));

    const result = await service.update(house.id, data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(applicationService.update).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(House);
  });

  it('should return error invalid id', async () => {
    const data = {
      name: chance().name(),
      phone: chance().phone(),
      email: chance().email(),
      address: chance().address(),
    };

    applicationService.getById.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.update(chance().guid({ version: 4 }), data);

    expect(result.isFailure()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });

  it('should return error invalid data', async () => {
    const House = createHouse();

    const data = {
      name: '',
      phone: chance().phone(),
      email: '',
      address: '',
    };

    applicationService.getById.mockResolvedValue(Result.ok(House));
    applicationService.update.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.update(chance().guid({ version: 4 }), data);

    expect(result.isFailure()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(applicationService.update).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('delete', () => {
  it('should delete a House', async () => {
    const house = createHouse();

    applicationService.remove.mockResolvedValue(Result.ok(true));

    const result = await service.delete(house.id);

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
