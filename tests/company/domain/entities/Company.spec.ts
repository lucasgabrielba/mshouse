import { v4 as uuidv4 } from 'uuid';
import {
  CreateCompanyPropsPrimitive,
  Company,
  CompanyProps,
} from '../../../../src/company/domain/entities/Company';
import { CompanyDTO } from '../../../../src/company/DTO/CompanyDTO';

describe('Company', () => {
  describe('create', () => {
    it('should create a new Company instance with valid properties', () => {
      const props: CreateCompanyPropsPrimitive = {
        name: 'Service',
        phone: '123456789',
        email: 'mycompany@example.com',
      };

      const result = Company.create(props);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Company);
      expect(result.data.name).toBe(props.name);
      expect(result.data.phone).toBe(props.phone);
      expect(result.data.email).toBe(props.email);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute a Company instance from a DTO', () => {
      const companyDTO: CompanyDTO = {
        id: uuidv4(),
        name: 'My Company',
        phone: '123456789',
        email: 'mycompany@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: undefined,
        deletedAt: undefined,
      };

      const result = Company.reconstitute(companyDTO);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Company);
      expect(result.data.name).toBe(companyDTO.name);
      expect(result.data.phone).toBe(companyDTO.phone);
      expect(result.data.email).toBe(companyDTO.email);
    });
  });

  describe('validate', () => {
    it('should validate a CompanyProps object with valid properties', () => {
      const data: CompanyProps = {
        id: uuidv4(),
        name: 'My Company',
        phone: '123456789',
        email: 'mycompany@example.com',
        createdAt: new Date(),
        updatedAt: undefined,
        deletedAt: undefined,
      };

      const result = Company.validate(data);

      expect(result.isSuccess()).toBe(true);
    });
  });
});
