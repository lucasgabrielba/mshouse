import { v4 as uuidv4 } from 'uuid';
import {
  CreateUserProps,
  User,
} from '../../../../src/company/domain/entities/User';
import { UserType } from '../../../../src/company/domain/enum/UserType';
import { UserDTO } from '../../../../src/company/DTO/UserDTO';
import { Chance as chance } from 'chance';
import { createCompany } from '../../../utils/company';

describe('User', () => {
  describe('create', () => {
    it('should create a new user', () => {
      const props: CreateUserProps = {
        name: 'John Doe',
        type: UserType.MANAGER,
        email: chance().email(),
        password: chance().hash(),
        company: createCompany(),
      };

      const result = User.create(props);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(User);
      expect(result.data.name).toBe(props.name);
      expect(result.data.type).toBe(props.type);
    });

    it('should fail when name is missing', () => {
      const props: CreateUserProps = {
        name: '',
        type: UserType.TECHNIQUE,
        email: chance().email(),
        password: chance().hash(),
        company: createCompany(),
      };

      const result = User.create(props);

      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('should fail when type is invalid', () => {
      const props: CreateUserProps = {
        name: 'Alice',
        type: 'INVALID_TYPE' as UserType,
        email: chance().email(),
        password: chance().hash(),
        company: createCompany(),
      };

      const result = User.create(props);

      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute an user from DTO', () => {
      const userDTO: UserDTO = {
        id: uuidv4(),
        name: 'Jane Smith',
        email: chance().email(),
        password: chance().hash(),
        company: createCompany().toDTO(),
        type: UserType.ATTENDANT,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        deletedAt: null,
      };

      const result = User.reconstitute(userDTO);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(User);
      expect(result.data.id).toBe(userDTO.id);
      expect(result.data.name).toBe(userDTO.name);
      expect(result.data.type).toBe(userDTO.type);
    });
  });
});
