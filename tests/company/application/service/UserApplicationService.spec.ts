import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { UserDomainService } from '../../../../src/company/domain/domainService/UserDomainService';
import { User } from '../../../../src/company/domain/entities/User';
import { createUser } from '../../../utils/user';
import { Chance as generate } from 'chance';
import { UserType } from '../../../../src/company/domain/enum/UserType';
import { Result } from '../../../../kernel/Result/Result';
import { CompanyApplicationService } from '../../../../src/company/application/service/CompanyApplicationService';
import { createCompany } from '../../../utils/company';
import { UserApplicationService } from '../../../../src/company/application/service/UserApplicationService';

let service: MockProxy<UserDomainService>;
let applicationService: UserApplicationService;

let companyApplicationService: MockProxy<CompanyApplicationService>;

beforeEach(() => {
  companyApplicationService = mock<CompanyApplicationService>()

  service = mock<UserDomainService>();
  applicationService = new UserApplicationService(service, companyApplicationService);
});

afterEach(() => {
  mockReset(service);
});

const userType = [
  UserType.MANAGER,
  UserType.ATTENDANT,
  UserType.TECHNIQUE,
];

describe('create', () => {
  it('should create an user', async () => {
    const user = createUser()
    const company = createCompany()

    const data = {
      name: generate().name(),
      type: generate().pickone(userType),
      email: generate().email(),
      password: generate().hash(),
      companyId: company.id
    };

    service.getOne.mockResolvedValue(Result.fail(new Error('')));
    companyApplicationService.getById.mockResolvedValue(Result.ok(company))
    service.createAndSave.mockResolvedValue(Result.ok(user));

    const result = await applicationService.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(User);
  });

  it('should return an error if missing data', async () => {
    const user = createUser()
    const company = createCompany()

    const data = {
      name: '',
      type: generate().pickone(userType),
      email: generate().email(),
      password: generate().hash(),
      companyId: company.id,
    };

    service.getOne.mockResolvedValue(Result.ok(user));
    companyApplicationService.getById.mockResolvedValue(Result.ok(company))
    service.createAndSave.mockResolvedValue(Result.fail(new Error('')));

    const result = await applicationService.create(data);

    expect(result.isFailure()).toBe(true);
    expect(result.data).toBe(null);
  });
});

describe('getById', () => {
  it('should return an user by ID', async () => {
    const user = createUser();

    service.get.mockResolvedValue(Result.ok(user));

    const result = await applicationService.getById(user.id);

    expect(result.isSuccess()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
  });

  it('should return error with invalid ID', async () => {
    service.get.mockResolvedValue(Result.fail(new Error('invalid')));

    const result = await applicationService.getById(
      generate().guid({ version: 4 }),
    );

    expect(result.isFailure()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('get', () => {
  it('should return an user by name', async () => {
    const user = createUser();

    service.getOne.mockResolvedValue(Result.ok(user));

    const result = await applicationService.get({
      where: { name: user.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
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

  it('should return an user by email', async () => {
    const user = createUser();

    service.getOne.mockResolvedValue(Result.ok(user));

    const result = await applicationService.get({
      where: { email: user.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
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

  it('should return an user by phone', async () => {
    const user = createUser();

    service.getOne.mockResolvedValue(Result.ok(user));

    const result = await applicationService.get({
      where: { phone: user.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(User);
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
  it('should return all users', async () => {
    const user = createUser();

    service.find.mockResolvedValue(Result.ok([user]));

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
  it('should return all users by filter', async () => {
    const user = createUser();

    service.filter.mockResolvedValue(Result.ok([user]));

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
