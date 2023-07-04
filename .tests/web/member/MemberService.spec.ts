import { MemberEntrypoint } from '../../../src/web/company/entrypoint/member.entrypoint';
import { MockProxy, mock, mockReset } from 'jest-mock-extended';
import { createMember } from '../../utils/member';
import { Result } from '../../../kernel/Result/Result';
import { Member } from '../../../src/company/domain/entities/Member';
import { MemberService } from '../../../src/web/company/member/member.service';
import { Chance as generate } from 'chance';
import { MemberType } from '../../../src/company/domain/enum/MemberType';
import { MemberApplicationService } from '../../../src/company/application/service/MemberApplicationService';

let service: MemberService;
let memberEntrypoint: MockProxy<MemberEntrypoint>;
let applicationService: MockProxy<MemberApplicationService>;

beforeEach(() => {
  memberEntrypoint = mock<MemberEntrypoint>();
  applicationService = mock<MemberApplicationService>();

  memberEntrypoint.getApplicationService.mockReturnValue(applicationService);

  service = new MemberService(memberEntrypoint);
});

afterEach(() => {
  mockReset(memberEntrypoint);
  mockReset(applicationService);
});

describe('listAllMember', () => {
  it('should list all members', async () => {
    const memberArray = [createMember(), createMember()];

    applicationService.all.mockResolvedValue(Result.ok(memberArray));

    const result = await service.listAllMember();

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Array);
  });

  it('should return error', async () => {
    applicationService.all.mockResolvedValue(Result.fail(new Error('error')));

    const result = await service.listAllMember();

    expect(result.isFailure()).toBe(true);
    expect(applicationService.all).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('findOne', () => {
  it('should return member by ID', async () => {
    const member = createMember();

    applicationService.getById.mockResolvedValue(Result.ok(member));

    const result = await service.findOne(member.id);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
  });

  it('should return error with invalid ID', async () => {
    applicationService.getById.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.findOne(generate().guid({ version: 4 }));

    expect(result.isFailure()).toBe(true);
    expect(applicationService.getById).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('create', () => {
  it('should create a member', async () => {
    const member = createMember();

    const data = {
      name: member.name,
      type: member.type,
      email: member.email,
      password: member.password,
      companyId: member.company.id,
    };

    applicationService.create.mockResolvedValue(Result.ok(member));

    const result = await service.create(data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.create).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
  });

  it('should return error invalid data', async () => {
    const data = {
      name: '',
      type: MemberType.ATTENDANT,
      email: '',
      password: '',
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
  it('should update a member', async () => {
    const member = createMember();

    const data = {
      name: generate().name(),
      type: member.type,
    };

    applicationService.updateEntity.mockResolvedValue(Result.ok(member));

    const result = await service.update(member.id, data);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBeInstanceOf(Member);
  });

  it('should return error invalid id', async () => {
    const data = {
      name: generate().name(),
      type: MemberType.ATTENDANT,
    };

    applicationService.updateEntity.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.update(generate().guid({ version: 4 }), data);

    expect(result.isFailure()).toBe(true);
    expect(applicationService.updateEntity).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});

describe('delete', () => {
  it('should delete a member', async () => {
    const member = createMember();

    applicationService.remove.mockResolvedValue(Result.ok(true));

    const result = await service.delete(member.id);

    expect(result.isSuccess()).toBe(true);
    expect(applicationService.remove).toHaveBeenCalled();
    expect(result.data).toBe(true);
  });

  it('should return error invalid id', async () => {
    applicationService.remove.mockResolvedValue(
      Result.fail(new Error('error')),
    );

    const result = await service.delete(generate().guid({ version: 4 }));

    expect(result.isFailure()).toBe(true);
    expect(applicationService.remove).toHaveBeenCalled();
    expect(result.data).toBe(null);
  });
});
