import { v4 as uuidv4 } from 'uuid';
import {
  CreateMemberProps,
  Member,
} from '../../../../src/company/domain/entities/Member';
import { MemberType } from '../../../../src/company/domain/enum/MemberType';
import { MemberDTO } from '../../../../src/company/DTO/MemberDTO';
import { Chance as generate } from 'chance';
import { createCompany } from '../../../utils/company';

describe('Member', () => {
  describe('create', () => {
    it('should create a new member', () => {
      const props: CreateMemberProps = {
        name: 'John Doe',
        type: MemberType.MANAGER,
        email: generate().email(),
        password: generate().hash(),
        company: createCompany(),
      };

      const result = Member.create(props);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Member);
      expect(result.data.name).toBe(props.name);
      expect(result.data.type).toBe(props.type);
    });

    it('should fail when name is missing', () => {
      const props: CreateMemberProps = {
        name: '',
        type: MemberType.TECHNIQUE,
        email: generate().email(),
        password: generate().hash(),
        company: createCompany(),
      };

      const result = Member.create(props);

      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('should fail when type is invalid', () => {
      const props: CreateMemberProps = {
        name: 'Alice',
        type: 'INVALID_TYPE' as MemberType,
        email: generate().email(),
        password: generate().hash(),
        company: createCompany(),
      };

      const result = Member.create(props);

      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute an member from DTO', () => {
      const memberDTO: MemberDTO = {
        id: uuidv4(),
        name: 'Jane Smith',
        email: generate().email(),
        password: generate().hash(),
        company: createCompany().toDTO(),
        refresh_token: generate().hash(),
        type: MemberType.ATTENDANT,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        deletedAt: null,
      };

      const result = Member.reconstitute(memberDTO);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Member);
      expect(result.data.id).toBe(memberDTO.id);
      expect(result.data.name).toBe(memberDTO.name);
      expect(result.data.type).toBe(memberDTO.type);
    });
  });
});
