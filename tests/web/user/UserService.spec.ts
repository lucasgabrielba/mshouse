import { UserEntrypoint } from '../../../src/web/company/entrypoint/user.entrypoint';
import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { createUser } from '../../utils/user';
import { Result } from '../../../kernel/Result/Result';
import { User } from '../../../src/company/domain/entities/User';
import { UserService } from '../../../src/web/company/user/user.service';
import { Chance as chance } from 'chance';
import { UserType } from '../../../src/company/domain/enum/UserType';
import { UserApplicationService } from '../../../src/company/application/service/UserApplicationService';

let service: UserService;
let userEntrypoint: MockProxy<UserEntrypoint>;
let applicationService: MockProxy<UserApplicationService>;

beforeEach(() => {
  userEntrypoint = mock<UserEntrypoint>();
  applicationService = mock<UserApplicationService>();

  userEntrypoint.getApplicationService.mockReturnValue(applicationService);

  service = new UserService(userEntrypoint);
});

afterEach(() => {
  mockReset(userEntrypoint);
  mockReset(applicationService);
});

describe('listAllUser', () => {
  it('should list all users', async () => {
    const userArray = [createUser(), createUser()];

    applicationService.all.mockResolvedValue(Result.ok(userArray));

    const result = await service.listAllUser();

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should return error', async () => {
    applicationService.all.mockResolvedValue(Result.fail(new Error('error')));

    const result = await service.listAllUser();

    expect(result.isFailure()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('findOne', () => {
  it('should return user by ID', async () => {
    const user = createUser();

    applicationService.getById.mockResolvedValue(Result.ok(user));

    const result = await service.findOne(user.id);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
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
  it('should create a user', async () => {
    const user = createUser();

    const data = {
      name: user.name,
      type: user.type,
      email: user.email,
      companyId: user.company.id,
    };

    applicationService.create.mockResolvedValue(Result.ok(user));

    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.create).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
  });

  it('should return error invalid data', async () => {
    const data = {
      name: '',
      type: UserType.ATTENDANT,
      email: '',
      companyId: ''
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
  it('should update a user', async () => {
    const user = createUser();

    const data = {
      name: chance().name(),
      type: user.type,
    };

    applicationService.updateEntity.mockResolvedValue(Result.ok(user));

    const result = await service.update(user.id, data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
  });

  it('should return error invalid id', async () => {
    const data = {
      name: chance().name(),
      type: UserType.ATTENDANT,
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
  it('should delete a user', async () => {
    const user = createUser();

    applicationService.remove.mockResolvedValue(Result.ok(true));

    const result = await service.delete(user.id);

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
