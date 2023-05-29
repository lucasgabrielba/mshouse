import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { UserRepositoryInterface } from '../../../../src/company/domain/repository/UserRepositoryInterface';
import { UserDomainService } from '../../../../src/company/domain/domainService/UserDomainService';
import { UserType } from '../../../../src/company/domain/enum/UserType';
import { User } from '../../../../src/company/domain/entities/User';
import { Chance as chance } from 'chance';
import { createUserDTO } from '../../../utils/user';
import { createCompany } from '../../../utils/company';

let repository: MockProxy<UserRepositoryInterface>;

beforeEach(() => {
  repository = mock<UserRepositoryInterface>();
});

afterEach(() => {
  mockClear(repository);
});

describe('Create User', () => {
  it('Should create User', async () => {
    const data = {
      name: 'test',
      type: UserType.MANAGER,
      email: chance().email(),
      password: chance().hash(),
      company: createCompany(),
    };

    const service = new UserDomainService(repository);
    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(User);
  });

  describe('Build User', () => {
    it('Should build a User', async () => {
      const dto = {
        ...createUserDTO('manager'),
        id: chance().guid({ version: 4 }),
      };

      const service = new UserDomainService(repository);
      const result = await service.build(dto);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(User);
    });
  });
});
