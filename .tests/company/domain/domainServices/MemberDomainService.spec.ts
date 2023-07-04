import { mock, mockClear, MockProxy } from 'jest-mock-extended';
import { MemberRepositoryInterface } from '../../../../src/company/domain/repository/MemberRepositoryInterface';
import { MemberDomainService } from '../../../../src/company/domain/domainService/MemberDomainService';
import { MemberType } from '../../../../src/company/domain/enum/MemberType';
import { Member } from '../../../../src/company/domain/entities/Member';
import { Chance as generate } from 'chance';
import { createMemberDTO } from '../../../utils/member';
import { createCompany } from '../../../utils/company';

let repository: MockProxy<MemberRepositoryInterface>;

beforeEach(() => {
  repository = mock<MemberRepositoryInterface>();
});

afterEach(() => {
  mockClear(repository);
});

describe('Create Member', () => {
  it('Should create Member', async () => {
    const data = {
      name: 'test',
      type: MemberType.MANAGER,
      email: generate().email(),
      password: generate().hash(),
      company: createCompany(),
    };

    const service = new MemberDomainService(repository);
    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Member);
  });

  describe('Build Member', () => {
    it('Should build a Member', async () => {
      const dto = {
        ...createMemberDTO('manager'),
        id: generate().guid({ version: 4 }),
      };

      const service = new MemberDomainService(repository);
      const result = await service.build(dto);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Member);
    });
  });
});
