import { v4 as uuidv4 } from 'uuid';
import {
  CreateEmployeeProps,
  Employee,
} from '../../../../src/house/domain/entities/Employee';
import { EmployeeType } from '../../../../src/house/domain/enum/EmployeeType';
import { EmployeeDTO } from '../../../../src/house/DTO/EmployeeDTO';

describe('Employee', () => {
  describe('create', () => {
    it('should create a new employee', () => {
      const props: CreateEmployeeProps = {
        name: 'John Doe',
        type: EmployeeType.MANAGER,
      };

      const result = Employee.create(props);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Employee);
      expect(result.data.name).toBe(props.name);
      expect(result.data.type).toBe(props.type);
    });

    it('should fail when name is missing', () => {
      const props: CreateEmployeeProps = {
        name: '',
        type: EmployeeType.TECHNIQUE,
      };

      const result = Employee.create(props);

      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });

    it('should fail when type is invalid', () => {
      const props: CreateEmployeeProps = {
        name: 'Alice',
        type: 'INVALID_TYPE' as EmployeeType,
      };

      const result = Employee.create(props);

      expect(result.isFailure()).toBe(true);
      expect(result.error).toBeInstanceOf(Error);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute an employee from DTO', () => {
      const employeeDTO: EmployeeDTO = {
        id: uuidv4(),
        name: 'Jane Smith',
        type: EmployeeType.ATTENDANT,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        deletedAt: null,
      };

      const result = Employee.reconstitute(employeeDTO);

      expect(result.isSuccess()).toBe(true);
      expect(result.data).toBeInstanceOf(Employee);
      expect(result.data.id).toBe(employeeDTO.id);
      expect(result.data.name).toBe(employeeDTO.name);
      expect(result.data.type).toBe(employeeDTO.type);
    });
  });
});
