import { mock, MockProxy, mockReset } from 'jest-mock-extended';
import { MemberDomainService } from '../../../../src/company/domain/domainService/MemberDomainService';
import { Member } from '../../../../src/company/domain/entities/Member';
import { createMember } from '../../../utils/member';
import { Chance as generate } from 'chance';
import { MemberType } from '../../../../src/company/domain/enum/MemberType';
import { Result } from '../../../../kernel/Result/Result';
import { CompanyApplicationService } from '../../../../src/company/application/service/CompanyApplicationService';
import { createCompany } from '../../../utils/company';
import { MemberApplicationService } from '../../../../src/company/application/service/MemberApplicationService';

let service: MockProxy<MemberDomainService>;
let applicationService: MemberApplicationService;

let companyApplicationService: MockProxy<CompanyApplicationService>;

beforeEach(() => {
  companyApplicationService = mock<CompanyApplicationService>()

  service = mock<MemberDomainService>();
  applicationService = new MemberApplicationService(service, companyApplicationService);
});

afterEach(() => {
  mockReset(service);
});

const memberType = [
  MemberType.MANAGER,
  MemberType.ATTENDANT,
  MemberType.TECHNIQUE,
];

describe('create', () => {
  it('should create an member', async () => {
    const member = createMember()
    const company = createCompany()

    const data = {
      name: generate().name(),
      type: generate().pickone(memberType),
      email: generate().email(),
      password: generate().hash(),
      companyId: company.id
    };

    service.getOne.mockResolvedValue(Result.fail(new Error('')));
    companyApplicationService.getById.mockResolvedValue(Result.ok(company))
    service.createAndSave.mockResolvedValue(Result.ok(member));

    const result = await applicationService.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(result.data).toBeInstanceOf(Member);
  });

  it('should return an error if missing data', async () => {
    const member = createMember()
    const company = createCompany()

    const data = {
      name: '',
      type: generate().pickone(memberType),
      email: generate().email(),
      password: generate().hash(),
      companyId: company.id,
    };

    service.getOne.mockResolvedValue(Result.ok(member));
    companyApplicationService.getById.mockResolvedValue(Result.ok(company))
    service.createAndSave.mockResolvedValue(Result.fail(new Error('')));

    const result = await applicationService.create(data);

    expect(result.isFailure()).toBe(true);
    expect(result.data).toBe(null);
  });
});

describe('getById', () => {
  it('should return an member by ID', async () => {
    const member = createMember();

    service.get.mockResolvedValue(Result.ok(member));

    const result = await applicationService.getById(member.id);

    expect(result.isSuccess()).toBe(true);
    expect(service.get).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
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
  it('should return an member by name', async () => {
    const member = createMember();

    service.getOne.mockResolvedValue(Result.ok(member));

    const result = await applicationService.get({
      where: { name: member.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
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

  it('should return an member by email', async () => {
    const member = createMember();

    service.getOne.mockResolvedValue(Result.ok(member));

    const result = await applicationService.get({
      where: { email: member.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
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

  it('should return an member by phone', async () => {
    const member = createMember();

    service.getOne.mockResolvedValue(Result.ok(member));

    const result = await applicationService.get({
      where: { phone: member.name },
    });

    expect(result.isSuccess()).toBe(true);
    expect(service.getOne).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
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
  it('should return all members', async () => {
    const member = createMember();

    service.find.mockResolvedValue(Result.ok([member]));

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
  it('should return all members by filter', async () => {
    const member = createMember();

    service.filter.mockResolvedValue(Result.ok([member]));

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
