import { v4 as uuidv4 } from 'uuid';
import {
  CreateHousePropsPrimitive,
  House,
  HouseProps,
} from '../../../../src/house/domain/entities/House';
import { HouseDTO } from '../../../../src/house/DTO/HouseDTO';

describe('House', () => {
  describe('create', () => {
    it('should create a new House instance with valid properties', () => {
      const props: CreateHousePropsPrimitive = {
        name: 'Service',
        phone: '123456789',
        email: 'myhouse@example.com',
      };

      const result = House.create(props);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(House);
      expect(result.data.name).toBe(props.name);
      expect(result.data.phone).toBe(props.phone);
      expect(result.data.email).toBe(props.email);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a House instance from a DTO', () => {
      const houseDTO: HouseDTO = {
        id: uuidv4(),
        name: 'My House',
        phone: '123456789',
        email: 'myhouse@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: undefined,
        deletedAt: undefined,
      };

      const result = House.reconstitute(houseDTO);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(House);
      expect(result.data.name).toBe(houseDTO.name);
      expect(result.data.phone).toBe(houseDTO.phone);
      expect(result.data.email).toBe(houseDTO.email);
    });
  });

  describe('validate', () => {
    it('should validate a HouseProps object with valid properties', () => {
      const data: HouseProps = {
        id: uuidv4(),
        name: 'My House',
        phone: '123456789',
        email: 'myhouse@example.com',
        createdAt: new Date(),
        updatedAt: undefined,
        deletedAt: undefined,
      };

      const result = House.validate(data);

      expect(result.isSuccess()).toBe(true);
    });
  });
});
